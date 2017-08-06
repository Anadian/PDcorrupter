#!/bin/bash
sep;
if (($# >= 3)); then
./pdcorrupter.js -r -I "$1" -O "$3" --step $2 && mednafen "$3";
else
./pdcorrupter.js -r -I "$1" -O "$2" --step 128 && mednafen "$2";
fi
