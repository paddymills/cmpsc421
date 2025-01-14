
set windows-shell := ["powershell.exe", "-NoProfile", "-Command"]

serve proj:
	miniserve --index src/{{proj}}/index.html

new proj:
	mkdir src/{{proj}}
	cp src/template.html src/{{proj}}/index.html
