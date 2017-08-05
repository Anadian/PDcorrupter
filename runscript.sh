#!/bin/bash
sep
./pdcorrupter2.js -r -I $1 -O $2 --step 128
mednafen $2
