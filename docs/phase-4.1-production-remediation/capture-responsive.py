import json
from pathlib import Path
from playwright.sync_api import sync_playwright
base='http://127.0.0.1:5211'
widths=[320,360,375,390,414,480,576,768,820,1024,1280,1366,1440,1920,2560]
slugs=['schooly','nora-store','edtech-platform','live-workshop','eduflow','legal-translation','gc-hardware','concord-crm','product-scraper']
pages=['','about','services','services/details','how-we-work','portfolio','contact']
routes=[f'/{locale}/{page}' if page else f'/{locale}' for locale in ['en','ar'] for page in pages]
routes += [f'/{locale}/projects/{slug}' for locale in ['en','ar'] for slug in slugs]
routes += ['/admin/login','/admin/inquiries']
results=[]; errors=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True)
 page=browser.new_page(viewport={'width':1440,'height':900},reduced_motion='reduce')
 page.on('pageerror',lambda e: errors.append({'type':'pageerror','message':str(e)}))
 page.on('console',lambda m: errors.append({'type':'console','message':m.text}) if m.type=='error' else None)
 for route in routes:
  for width in widths:
   page.set_viewport_size({'width':width,'height':900})
   try:
    response=page.goto(base+route,wait_until='domcontentloaded',timeout=30000)
    result=page.evaluate('''() => {
      const root=document.documentElement, h=document.querySelector('main h1:not(.visually-hidden), h1:not(.visually-hidden)');
      const imgs=[...document.images].filter(i=>i.complete&&i.currentSrc);
      let clipped=false;
      if(h){
        const ancestors=[]; for(let n=h;n;n=n.parentElement){const c=getComputedStyle(n);if([c.overflowX,c.overflowY].some(v=>v==='hidden'||v==='clip'))ancestors.push(n.getBoundingClientRect());}
        const walker=document.createTreeWalker(h,NodeFilter.SHOW_TEXT); let t;
        while((t=walker.nextNode())){if(!t.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(t);for(const r of range.getClientRects())for(const a of ancestors)if(r.left<a.left-1||r.right>a.right+1||r.top<a.top-1||r.bottom>a.bottom+1)clipped=true;}
      }
      return {scrollWidth:root.scrollWidth,clientWidth:root.clientWidth,lang:root.lang,dir:root.dir,h1:h?.innerText?.trim()||null,h1Clipped:clipped,brokenImages:imgs.filter(i=>i.naturalWidth===0).map(i=>i.currentSrc)};
    }''')
    results.append({'route':route,'width':width,'status':response.status if response else 0,**result})
   except Exception as e:
    results.append({'route':route,'width':width,'status':0,'error':str(e)})
 browser.close()
out={'baseUrl':base,'generatedAt':'2026-10-19','routes':routes,'widths':widths,'observationCount':len(results),'non200':[x for x in results if x['status']!=200],'overflow':[x for x in results if x.get('scrollWidth',0)>x.get('clientWidth',0)+1],'clippedHeadings':[x for x in results if x.get('h1Clipped')],'brokenImages':[x for x in results if x.get('brokenImages')],'pageErrors':errors,'results':results}
Path('docs/phase-4.1-production-remediation/responsive-regression.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({k:(len(v) if isinstance(v,list) else v) for k,v in out.items() if k not in ['results','routes','widths']}))
