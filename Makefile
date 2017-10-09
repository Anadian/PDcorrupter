#!/usr/bin/make
mkvar(NAME,PDCORRUPTER)
mkvar(ENGINE,node)
mkvar(SOURCE_DIRECTORY,./source)
mkvar(SOURCE_FILES,$(wildcard $(SOURCE_DIRECTORY)/*.js))

.PHONY: expand prepare configure compile assemble test document package link distribute report clean help
expand:
	vim $(SOURCE_FILES) -S ~/.expansions
prepare:
	
configure:
	
compile:
	
assemble:
	
test:
	
document:
	
package:
	
link:
	
distribute:
	
report:
	
clean:
	
help:
	
