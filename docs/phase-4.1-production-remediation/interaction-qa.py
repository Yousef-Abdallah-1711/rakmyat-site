import json,re
from pathlib import Path
from playwright.sync_api import sync_playwright
base='http://127.0.0.1:5211'; checks=[]; errors=[]
def check(name,condition,detail=None):checks.append({'name':name,'passed':bool(condition),'detail':detail})
with sync_playwright() as p:
 b=p.chromium.launch(headless=True); page=b.new_page(viewport={'width':1440,'height':900},reduced_motion='reduce')
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(base+'/en',wait_until='networkidle')
 details=page.locator('details.language-switcher'); details.locator('summary').click()
 check('language dropdown opens',details.get_attribute('open') is not None)
 current=details.locator('a[aria-current="page"]')
 check('current locale is identified',current.count()==1 and current.get_attribute('lang')=='en')
 arLink=details.locator('a[lang="ar"]'); arHref=arLink.get_attribute('href'); arLink.click(); page.wait_for_url('**/ar', timeout=10000)
 check('locale switch preserves home route',page.url.rstrip('/').endswith('/ar'))
 page.wait_for_function("document.documentElement.dir === 'rtl'")
 check('Arabic document direction',page.locator('html').get_attribute('dir')=='rtl')
 page.goto(base+'/en/portfolio',wait_until='networkidle')
 total=page.locator('.project-showcase-card').count(); buttons=page.locator('.controls button')
 check('portfolio has all nine projects',total==9,total)
 if buttons.count()>1:
  buttons.nth(1).click(); page.wait_for_timeout(100)
  filtered=page.locator('.project-showcase-card').count()
  check('portfolio category filter changes visible cards',0<filtered<total,filtered)
  buttons.first.click(); page.wait_for_timeout(100)
  check('portfolio all filter restores nine',page.locator('.project-showcase-card').count()==9)
 link=page.locator('.project-showcase-link').first
 accessible=link.get_attribute('aria-label') or ''
 check('project link accessible name contains visible label',link.inner_text().strip().lower() in accessible.lower(),{'visible':link.inner_text().strip(),'accessible':accessible})
 link.click(); page.wait_for_url('**/en/projects/**', timeout=10000)
 check('project navigation reaches a localized case study','/en/projects/' in page.url and page.locator('main h1').count()==1,page.url)
 admin=page.request.get(base+'/api/admin/inquiries')
 check('unauthenticated admin API is rejected',admin.status==401,admin.status)
 check('admin response is no-store', 'no-store' in admin.headers.get('cache-control',''),admin.headers.get('cache-control'))
 for locale in ['en','ar']:
  page.goto(base+f'/{locale}/contact',wait_until='networkidle')
  form=page.locator('form.inquiry-form'); name=form.locator('[name="fullName"]'); phone=form.locator('[name="phone"]')
  form.locator('button[type=submit]').click()
  check(f'{locale}: required fields announce errors',name.get_attribute('aria-invalid')=='true' and phone.get_attribute('aria-invalid')=='true')
  check(f'{locale}: invalid controls receive focus',page.locator(':focus').get_attribute('name')=='fullName')
  name.fill('Phase QA'); phone.fill('+201012345678')
  form.locator('[name="email"]').fill('invalid-email'); form.locator('[name="email"]').blur()
  check(f'{locale}: invalid email is associated with its error',form.locator('[name="email"]').get_attribute('aria-invalid')=='true')
  form.locator('[name="email"]').fill(''); form.locator('[name="email"]').blur()
  with page.expect_response(lambda response:response.url.endswith('/api/inquiries') and response.request.method=='POST',timeout=10000) as response_info:
   form.locator('button[type=submit]').click()
  response=response_info.value
  check(f'{locale}: unconfigured endpoint returns failure without false success',response.status in [403,503],response.status)
  check(f'{locale}: values remain after endpoint failure',name.input_value()=='Phase QA' and phone.input_value()=='+201012345678')
  text=form.locator('[role="alert"]').last.inner_text() if form.locator('[role="alert"]').count() else ''
  check(f'{locale}: failure status is announced',bool(text),text)
 page.set_viewport_size({'width':390,'height':844});page.goto(base+'/en',wait_until='networkidle')
 toggle=page.get_by_role('button',name='Toggle navigation')
 check('mobile navigation toggle meets touch target',toggle.count()==1 and toggle.bounding_box()['height']>=44,toggle.bounding_box() if toggle.count() else None)
 if toggle.count():
  toggle.click();check('mobile navigation opens',page.locator('.navbar-collapse.show').count()==1)
 check('reduced-motion preference is active',page.evaluate('matchMedia("(prefers-reduced-motion: reduce)").matches'))
 check('no browser page errors',len(errors)==0,errors)
 b.close()
out={'baseUrl':base,'checks':checks,'passCount':sum(c['passed'] for c in checks),'failCount':sum(not c['passed'] for c in checks),'pageErrors':errors}
Path('docs/phase-4.1-production-remediation/interaction-results.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(out,ensure_ascii=True))



