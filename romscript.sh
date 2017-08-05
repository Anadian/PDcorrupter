#!/bin/bash
sep && ./pdcorrupter2.js -r -I /Users/cameron/ROMs/SNES/Super\ Mario\ Kart\ \(USA\).sfc -O $1 --step 128 && mednafen $1
