from lxml import html
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[2]
APP=Path(__file__).resolve().parents[1]
doc=html.document_fromstring((ROOT/'public/home-saas-technology.html').read_bytes())
body=doc.find('body')
VOID={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
MAP={'class':'className','for':'htmlFor','tabindex':'tabIndex','readonly':'readOnly','maxlength':'maxLength','colspan':'colSpan','rowspan':'rowSpan','autofocus':'autoFocus','crossorigin':'crossOrigin','contenteditable':'contentEditable','srcset':'srcSet','usemap':'useMap','autocomplete':'autoComplete','datetime':'dateTime','playsinline':'playsInline','frameborder':'frameBorder'}
ROUTES={'home-saas-technology.html':'/','page-about-5.html':'/about','page-contact-5.html':'/contact','page-portfolio-5.html':'/portfolio','page-services-5.html':'/services','page-services-details-5.html':'/services/details','page-single-project-5.html':'/projects/notero'}
def style_obj(v):
 p=[]
 for item in v.split(';'):
  if ':' not in item:continue
  k,val=item.split(':',1);k=k.strip();val=val.strip()
  if not k or not val:continue
  k=json.dumps(k) if k.startswith('--') else re.sub(r'-([a-z])',lambda m:m.group(1).upper(),k)
  p.append(f'{k}: {json.dumps(val,ensure_ascii=False)}')
 return '{{'+', '.join(p)+'}}'
def attr(k,v):
 name=MAP.get(k,k)
 if k=='style':return f'style={style_obj(v)}'
 if k in ('src','href') and v:
  clean=v.strip().lstrip('./')
  if clean in ROUTES:v=ROUTES[clean]
  elif not re.match(r'^(?:/|#|https?:|mailto:|tel:|data:)',v):v='/'+clean
 return f'{name}={{{json.dumps(v,ensure_ascii=False)}}}'
def render(el,root=False):
 if not isinstance(el.tag,str) or el.tag in ('script','style','noscript'):return ''
 a=' '.join(attr(k,v) for k,v in el.attrib.items() if not k.lower().startswith('on'))
 a=(' '+a) if a else ''
 t=el.tag
 href=el.get('href','').strip(); clean=href.lstrip('./'); mapped=ROUTES.get(clean,href)
 render_tag='Link' if t=='a' and mapped.startswith('/') and not mapped.startswith('/assets/') else t
 out=f'<{render_tag}{a}'
 if t in VOID:return out+' />'
 out+='>'
 if el.text:out+='{'+json.dumps(el.text,ensure_ascii=False)+'}'
 for c in el:
  out+=render(c)
  if c.tail:out+='{'+json.dumps(c.tail,ensure_ascii=False)+'}'
 return out+f'</{render_tag}>'
bar=next(n for n in body if isinstance(n.tag,str) and n.tag=='div' and n.get('class','').startswith('top-navbar'))
footer=next(n for n in body if isinstance(n.tag,str) and n.tag=='footer')
footer.attrib.pop('class',None)
barjs=render(bar); footerjs=render(footer)
text='''import Link from "next/link";
import type { ReactNode } from "react";

export function TopPromotion() {
  return (\n    '''+barjs+'''\n  );
}

export function SiteFooter({ children, bordered = false }: { children?: ReactNode; bordered?: boolean }) {
  return (\n    <footer className={`style-5${' border-top brd-gray' if False else ''}`}>
      {children}
    </footer>
  );
}
'''
# Footer variant retains exact source subtree, with common root classes applied separately below.
text='''import Link from "next/link";
import type { ReactNode } from "react";

export function TopPromotion() {
  return (\n    '''+barjs+'''\n  );
}

export function SiteFooter({ children, bordered = false }: { children: ReactNode; bordered?: boolean }) {
  return (\n    <footer className={`style-5${bordered ? " border-top brd-gray" : ""}`}>
      {children}
    </footer>
  );
}

export function FooterContent() {
  return (\n    '''+''.join(render(c) for c in footer)+'''\n  );
}
'''
(APP/'components/layout/SiteChrome.tsx').write_text(text,encoding='utf-8')
