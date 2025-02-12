
set windows-shell := ["powershell.exe", "-NoProfile", "-Command"]

branch := `git branch --show-current`

[private]
default:
  just --list

wk num:
	git checkout -B wk{{num}} template

serve proj:
	miniserve --index index.html src/{{proj}}

new proj:
	mkdir src/{{proj}}
	cp src/template.html src/{{proj}}/index.html

[working-directory: 'src']
zip:
    ls -d */ | zip -r@ PatrickMiller_{{branch}}.zip
    mv PatrickMiller_{{branch}}.zip ..
