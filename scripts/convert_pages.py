from lxml import html
from pathlib import Path
import html as html_lib, json, re

ROOT=Path(__file__).resolve().parents[2]
APP=Path(__file__).resolve().parents[1]
SRC=ROOT/'public'
OUT=APP/'components'/'sections'
OUT.mkdir(parents=True,exist_ok=True)
PAGES=[
 ('home-saas-technology','Home'),('page-about-5','About'),('page-services-5','Services'),
 ('page-services-details-5','ServiceDetails'),('page-portfolio-5','Portfolio'),
 ('page-single-project-5','SingleProject'),('page-contact-5','Contact')]
VOID={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
SEMANTIC={'section','main','header'}
ATTRS={'class':'className','for':'htmlFor','tabindex':'tabIndex','readonly':'readOnly','maxlength':'maxLength','colspan':'colSpan','rowspan':'rowSpan','autofocus':'autoFocus','crossorigin':'crossOrigin','contenteditable':'contentEditable','srcset':'srcSet','usemap':'useMap','formaction':'formAction','autocomplete':'autoComplete','formnovalidate':'formNoValidate','novalidate':'noValidate','datetime':'dateTime','playsinline':'playsInline','frameborder':'frameBorder','referrerpolicy':'referrerPolicy','defaultvalue':'defaultValue','allowfullscreen':'allowFullScreen'}
BOOL={'defaultChecked','disabled','multiple','required','readOnly','autoFocus','selected','noValidate','formNoValidate','hidden','controls','loop','muted','open','playsInline','allowFullScreen'}
ROUTES={'home-saas-technology.html':'/','page-about-5.html':'/about','page-contact-5.html':'/contact','page-portfolio-5.html':'/portfolio','page-services-5.html':'/services','page-services-details-5.html':'/services/details','page-single-project-5.html':'/projects/notero'}

def name_component(page,index,tag,classes):
    parts=[re.sub(r'[^a-zA-Z0-9]+',' ',c).title().replace(' ','') for c in classes.split()[:2] if c]
    suffix=''.join(parts) or tag.title()
    return f'{page}{suffix}Section{index}'

def jsx_text(value):
    if not value: return ''
    if value.isspace():
        if '\n' in value or '\r' in value: return ''
        return '{'+json.dumps(value,ensure_ascii=False)+'}'
    return '{'+json.dumps(value,ensure_ascii=False)+'}'

def attr_value(k,v):
    if k in ('src','href','action','formaction') and v:
        v=v.strip()
        clean=v.lstrip('./')
        if k in ('href','action','formaction') and clean in ROUTES: v=ROUTES[clean]
        elif k in ('href','action','formaction') and v in ROUTES: v=ROUTES[v]
        elif k in ('src','href','action','formaction') and not re.match(r'^(?:/|#|https?:|mailto:|tel:|data:|javascript:)',v): v='/'+clean
        if k=='href' and v in ('/page-blog-5.html','/page-blog-3.html'): v='/portfolio'
    return v

def style_object(value):
    pairs=[]
    for item in value.split(';'):
        if ':' not in item: continue
        key,val=item.split(':',1); key=key.strip(); val=val.strip()
        if not key or not val: continue
        if key.startswith('--'): jskey=json.dumps(key)
        else: jskey=re.sub(r'-([a-z])',lambda m:m.group(1).upper(),key)
        pairs.append(f'{jskey}: {json.dumps(val,ensure_ascii=False)}')
    return '{{'+', '.join(pairs)+'}}'

def attrs(el, omit=()):
    out=[]
    for k,v in el.attrib.items():
        if k in omit or k.lower().startswith('on'): continue
        key=ATTRS.get(k.lower(),k)
        if k.lower()=='checked': key='defaultChecked'
        if k=='style': out.append(f'style={style_object(v)}'); continue
        if key in {'rows','cols','span','size','start'} and v.isdigit(): out.append(f'{key}={{{v}}}'); continue
        val=attr_value(k.lower(),v)
        if key in BOOL:
            if val.lower() in ('',key.lower(),k.lower(),'true'): out.append(f'{key}={{true}}')
            else: out.append(f'{key}={{{str(val).lower() == "true"}}}')
        else: out.append(f'{key}={{{json.dumps(val,ensure_ascii=False)}}}')
    return (' '+' '.join(out)) if out else ''

def is_skip(el): return not isinstance(el.tag,str) or el.tag in ('script','style','noscript')

for stem,page in PAGES:
    doc=html.document_fromstring((SRC/(stem+'.html')).read_bytes())
    body=doc.find('body')
    body_nodes=[]
    for node in body:
        if is_skip(node): continue
        classes=node.get('class','')
        if node.get('id')=='preloader' or 'to_top' in classes.split(): continue
        if node.tag=='div' and classes.startswith('top-navbar'): continue
        if node.tag=='nav' or node.tag=='footer': continue
        body_nodes.append(node)

    registry=[]; names={}
    def render(el, root_node=None):
        if is_skip(el): return ''
        tag=el.tag
        if tag in SEMANTIC and el is not root_node:
            if el not in names:
                idx=len(registry)+1; classes=el.get('class','')
                name=name_component(page,idx,tag,classes); names[el]=name; registry.append(el)
            return f'<{names[el]} />'
        if tag=='input' and el.get('id') in ('monthly-input','yearly-input'):
            attr=attrs(el,omit=('checked',))
            return f'<PricingPeriodInput{attr} />'
        if tag=='select':
            selected_options=el.xpath('.//option[@selected]')
            if selected_options:
                selected=selected_options[0]
                el.set('defaultvalue', selected.get('value') or ''.join(selected.itertext()).strip())
                for option in selected_options: option.attrib.pop('selected',None)
        if tag=='form':
            attr=attrs(el,omit=('action','method','enctype','accept-charset'))
            inner=children(el,root_node)
            return f'<ContactForm{attr}>{inner}</ContactForm>'
        attr=attrs(el)
        mapped_href=attr_value('href',el.get('href','')) if tag=='a' else ''
        render_tag='Link' if tag=='a' and mapped_href.startswith('/') and not mapped_href.startswith('/assets/') else tag
        open_tag=f'<{render_tag}{attr}'
        if tag in VOID: return open_tag+' />'
        inner=children(el,root_node)
        return open_tag+'>'+inner+f'</{render_tag}>'
    def children(el,root_node):
        pieces=[]
        if el.text: pieces.append(jsx_text(el.text))
        for child in el:
            if is_skip(child):
                if child.tail: pieces.append(jsx_text(child.tail))
                continue
            pieces.append(render(child,root_node))
            if child.tail: pieces.append(jsx_text(child.tail))
        return ''.join(pieces)
    top=''.join(render(node) for node in body_nodes)
    definitions=[]
    i=0
    while i<len(registry):
        el=registry[i]; name=names[el]; markup=render(el,el)
        definitions.append(f'function {name}() {{\n  return (\n    {markup}\n  );\n}}')
        i+=1
    component_markup=top+'\n'.join(definitions)
    imports=[]
    if '<ContactForm' in component_markup: imports.append('import { ContactForm } from "@/components/forms/ContactForm";')
    if '<PricingPeriodInput' in component_markup: imports.append('import { PricingPeriodInput } from "@/components/sections/PricingPeriod";')
    if '<Link' in component_markup: imports.append('import Link from "next/link";')
    source='\n'.join(imports)+'\n\n' if imports else ''
    source+=f'export function {page}SourceSections() {{\n  return (\n    <>\n      {top}\n    </>\n  );\n}}\n\n'
    source+='\n\n'.join(definitions)+'\n'
    (OUT/f'{page}SourceSections.tsx').write_text(source,encoding='utf-8')
    print(page, 'sections',len(registry),'bytes',len(source))


