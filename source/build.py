import base64
s = open('src.html').read()
for k in ['closed','scene','pillarL','pillarR','wren_idle','wren_walk','wren_guard','wren_hit','wrenb_idle','wrenb_walk','wrenb_hit','drac_idle','drac_walk','drac_cast','drac_hit']:
    d = 'data:image/webp;base64,' + base64.b64encode(open(f'art/{k}.webp','rb').read()).decode()
    s = s.replace(f'%%{k.upper()}%%', d)
assert '%%' not in s
open('crypt-compact.html','w').write(s); print(len(s))
