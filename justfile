
set windows-shell := ["powershell.exe", "-NoProfile", "-Command"]

wk num:
	git checkout -B wk{{num}} template

serve proj:
	miniserve --index index.html src/{{proj}}

new proj:
	mkdir src/{{proj}}
	cp src/template.html src/{{proj}}/index.html
