from __future__ import annotations
import argparse, csv, json
from io import BytesIO
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image

PAGES = {
    "home": "", "about": "about", "services": "services",
    "services-details": "services/details", "how-we-work": "how-we-work",
    "portfolio": "portfolio", "projects-nora-store": "projects/nora-store", "contact": "contact",
}
WIDTHS = [320, 360, 390, 412, 430, 768, 900, 1024, 1280, 1440]

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--base-url',default='http://127.0.0.1:5214')
    ap.add_argument('--output-dir',required=True)
    args=ap.parse_args()
    out=Path(args.output_dir); shots=out/'screenshots'; shots.mkdir(parents=True,exist_ok=True)
    observations=[]; errors=[]; interactions=[]
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True)
        page=browser.new_page(reduced_motion='reduce')
        page.on('pageerror',lambda e: errors.append({'type':'pageerror','message':str(e),'url':page.url}))
        page.on('console',lambda m: errors.append({'type':'console','message':m.text,'url':page.url}) if m.type=='error' else None)
        for locale in ['en','ar']:
            for name,path in PAGES.items():
                url=f"{args.base_url}/{locale}"+(f'/{path}' if path else '')
                for width in WIDTHS:
                    page.set_viewport_size({'width':width,'height':900})
                    response=page.goto(url,wait_until='domcontentloaded',timeout=30000)
                    page.wait_for_timeout(120)
                    info=page.evaluate('''() => ({
                      width: innerWidth, docWidth: document.documentElement.scrollWidth,
                      bodyWidth: document.body.scrollWidth, lang: document.documentElement.lang,
                      dir: document.documentElement.dir,
                      h1: [...document.querySelectorAll('h1')].some(x => !!(x.offsetWidth||x.offsetHeight||x.getClientRects().length)),
                      menuToggleVisible: !!document.querySelector('.navbar-toggler') && getComputedStyle(document.querySelector('.navbar-toggler')).display !== 'none',
                      menuExpanded: document.querySelector('.navbar-toggler')?.getAttribute('aria-expanded'),
                      viewport: {w:innerWidth,h:innerHeight}
                    })''')
                    observation={'locale':locale,'page':name,'width':width,'status':response.status if response else None,**info}
                    observation['horizontalOverflow']=info['docWidth']>width
                    observation['expectedMenuToggle']=width<1200
                    observation['menuModePass']=info['menuToggleVisible']==observation['expectedMenuToggle']
                    observation['localePass']=info['lang']==locale and info['dir']==('rtl' if locale=='ar' else 'ltr')
                    observation['pass']=response is not None and response.status==200 and info['h1'] and not observation['horizontalOverflow'] and observation['menuModePass'] and observation['localePass']
                    observations.append(observation)
                    if width in [320,900,1440] and name in ['home','services-details','portfolio','contact']:
                        page.wait_for_timeout(300)
                        image=Image.open(BytesIO(page.screenshot(full_page=False))).convert('RGB')
                        image.save(shots/f'{locale}-{name}-{width}.webp','WEBP',quality=88,method=6)
        # Menu, language switch, portfolio filter, and project gallery checks.
        page.set_viewport_size({'width':900,'height':900})
        page.goto(f'{args.base_url}/en',wait_until='domcontentloaded'); page.wait_for_timeout(200)
        toggle=page.locator('.navbar-toggler'); toggle.click()
        menu_open=toggle.get_attribute('aria-expanded')=='true' and 'show' in (page.locator('#navbarSupportedContent').get_attribute('class') or '')
        page.keyboard.press('Escape'); page.wait_for_timeout(80)
        menu_escape=toggle.get_attribute('aria-expanded')=='false' and page.evaluate('document.activeElement===document.querySelector(".navbar-toggler")')
        interactions.append({'name':'900px menu opens and Escape closes with focus restored','pass':menu_open and menu_escape,'open':menu_open,'escape':menu_escape})
        page.set_viewport_size({'width':1280,'height':900})
        page.goto(f'{args.base_url}/en',wait_until='domcontentloaded'); page.wait_for_timeout(150)
        page.locator('.language-switcher summary').click(); page.locator('.language-switcher a[lang="ar"]').click(); page.wait_for_url('**/ar')
        interactions.append({'name':'locale switch preserves the current route','pass':page.url.endswith('/ar'),'url':page.url})
        page.set_viewport_size({'width':390,'height':844})
        page.goto(f'{args.base_url}/en/portfolio',wait_until='domcontentloaded'); page.wait_for_timeout(200)
        controls=page.locator('.controls button'); buttons=controls.all(); before=page.locator('.project-showcase-card').count()
        target=next((b for b in buttons if b.get_attribute('aria-pressed')=='false'),None)
        if target:
            target.click(); page.wait_for_timeout(100)
        after=page.locator('.project-showcase-card').count()
        portfolio_pass=target is not None and target.get_attribute('aria-pressed')=='true' and after>0 and after<before
        interactions.append({'name':'portfolio category filters update visible projects','pass':portfolio_pass,'before':before,'after':after})
        page.goto(f'{args.base_url}/en/projects/nora-store',wait_until='domcontentloaded'); page.wait_for_timeout(200)
        page.locator('a[data-fancybox]').first.click(); page.wait_for_timeout(100)
        dialog_open=page.locator('.media-lightbox[role="dialog"]').is_visible()
        page.keyboard.press('Escape'); page.wait_for_timeout(100)
        dialog_closed=not page.locator('.media-lightbox[role="dialog"]').is_visible()
        interactions.append({'name':'project gallery opens and closes with Escape','pass':dialog_open and dialog_closed,'open':dialog_open,'closed':dialog_closed})
        page.goto(f'{args.base_url}/en/contact',wait_until='domcontentloaded'); page.wait_for_timeout(200)
        form=page.locator('.inquiry-form')
        contact_invalid=not form.evaluate('(f)=>f.checkValidity()')
        interactions.append({'name':'contact form rejects empty required fields before submission','pass':contact_invalid})
        result={'baseUrl':args.base_url,'observations':len(observations),'responsivePasses':sum(bool(x['pass']) for x in observations),'responsiveFailures':[x for x in observations if not x['pass']],'interactionChecks':interactions,'interactionFailures':[x for x in interactions if not x['pass']],'browserErrors':errors}
        out.mkdir(parents=True,exist_ok=True)
        with (out/'viewport-observations.csv').open('w',newline='',encoding='utf-8') as f:
            w=csv.DictWriter(f,fieldnames=observations[0].keys());w.writeheader();w.writerows(observations)
        (out/'interaction-results.json').write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding='utf-8')
        print(json.dumps({k:v for k,v in result.items() if k not in ['responsiveFailures','interactionFailures','browserErrors']},indent=2,ensure_ascii=False))
        print('responsive failures:',len(result['responsiveFailures']),'interaction failures:',len(result['interactionFailures']),'browser errors:',len(errors))
        browser.close()
if __name__=='__main__': main()
