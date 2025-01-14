
set windows-shell := ["powershell.exe", "-NoProfile", "-Command"]

serve proj:
	miniserve --index index.html src/{{proj}}

new proj:
	mkdir src/{{proj}}
	cp src/template.html src/{{proj}}/index.html
