"""Read-only checks for local assets, links, IDs and semantic form wiring."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
if len(sys.argv) > 1:
    ROOT = (ROOT / sys.argv[1]).resolve()
VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
class Structure(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids=[]; self.references=[]; self.assets=[]; self.stack=[]; self.issues=[]; self.images=0; self.headings=0; self.required=[]
    def handle_starttag(self, tag, pairs):
        a=dict(pairs)
        if tag not in VOID:
            if tag=='a' and 'a' in self.stack: self.issues.append('Nested link')
            self.stack.append(tag)
        if 'id' in a: self.ids.append(a['id'])
        for k in ('for','aria-controls','aria-labelledby','aria-describedby'):
            if a.get(k): self.references.extend(a[k].split())
        if tag=='a' and a.get('href','').startswith('#'): self.references.append(a['href'][1:])
        for k in ('src','href'):
            u=a.get(k,'')
            if u and not u.startswith('#') and not urlsplit(u).scheme: self.assets.append(urlsplit(u).path)
        if tag=='img':
            self.images+=1
            if 'alt' not in a: self.issues.append('Missing image alt')
        if tag=='h1': self.headings+=1
        if tag in {'input','select','textarea'} and 'required' in a: self.required.append(a.get('id'))
        if tag=='a' and a.get('target')=='_blank' and 'noopener' not in a.get('rel',''): self.issues.append('Unsafe target blank')
    def handle_endtag(self, tag):
        if tag in VOID: return
        if not self.stack or self.stack[-1]!=tag: self.issues.append('Unbalanced tag: '+tag)
        else: self.stack.pop()

p=Structure(); p.feed((ROOT/'index.html').read_text(encoding='utf-8'))
p.issues.extend('Missing target: '+x for x in p.references if x not in p.ids)
p.issues.extend('Missing asset: '+x for x in p.assets if not ((ROOT/x).is_file() or (ROOT/x/'index.html').is_file()))
if len(set(p.ids))!=len(p.ids): p.issues.append('Duplicate IDs')
if p.headings!=1: p.issues.append('Expected exactly one h1')
if p.required!=['contact']: p.issues.append('Expected contact to be the only required field')
if p.stack: p.issues.append('Unclosed tags: '+str(p.stack))
result={'status':'PASS' if not p.issues else 'FAIL','ids':len(p.ids),'references':len(p.references),'images':p.images,'local_resources_checked':len(p.assets),'issues':p.issues}
print(json.dumps(result,ensure_ascii=False,indent=2))
raise SystemExit(bool(p.issues))
