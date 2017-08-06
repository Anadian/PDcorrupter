#!/bin/bash
sep
./pdcorrupter.js -r -I $1 -O $2 --step 128
mednafen $2
