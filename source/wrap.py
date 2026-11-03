# Builds ../public/index.html from src.html and art/: run `python build.py && python wrap.py` inside source/
body = open('crypt-compact.html').read()
head = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<style>*,*::before,*::after{box-sizing:border-box}[hidden]{display:none!important}img{max-width:100%}</style>\n'
split = body.index('<div id="app">')
open('../public/index.html', 'w').write(head + body[:split] + '</head>\n<body>\n' + body[split:] + '\n</body>\n</html>\n')
print('wrote ../public/index.html')
