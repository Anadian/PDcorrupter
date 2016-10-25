# PDcorrupter
A simple-stupid file corrupter implemented as a single, public-domain Perl script.

## Basic usage
pdcorrupter.pl reads a given input file, one byte at a time, pushing each byte into an array, the it 'corrupts' bytes of a given interval by a random magnitude, and then writes the array to an output file. It takes it parametres as plain-old GNU options. 
`pdcorrupter.pl [options]`
It takes the following options:
* `inputfilename [filename]`: The file you'd like to corrupt. e.g. 'a_game.rom'
* `startbyte [byte]`: A **decimal** number specifying the byte begin corrupting on; useful for avoiding headers. e.g. `1000` to begin corruption on the first kilobyte. 
* `endbyte [byte]`: A decimal number specifying where it should stop corrupting. e.g. a `startbyte` of `5000` and an `endbyte` of `5005000` would specify a range of 5 MB, from 1 KB to 5005 KB.
* `step [bytes]`: The interval, on which, it will corrupt a byte. e.g. A value of `2` would corrupt every other byte, `256` will corrupt every 256'th byte, et cetera.
* `outputfilename [filename]`: The file to save the the corrupted output to. e.g. 'a_corrupted_game.rom'
* `magnitude [unsigned 8-bit integer]`: The maximum factor by which a byte can be modified: a lower number for a less severe corruption and a higher number for a more severe, more polarizing, corruption. Defaults to 128.
It uses the perl Getopt::Long module to process so you only to type enough characters to make an option unambigous:
`pdcorrupter.pl --inputfilename ./input.rom --startbyte 1000 --endbyte 2000 --step 8 --outputfilename cor_output.rom`
has the same effect as:
`pdcorrupter.pl -i ./input.rom -sta 1000 -e 2000 -ste 8 -o cor_outpur.rom`
pdcorrupter.pl corrupts a byte by selecting a random operation (+ plus, - minus, * multiply, / divide, or % modulus) to perform on it and a random integer, between 0 and `magnitude`, to use as the second operand.
pdcorrupter.pl will print its operations with the format "[byte_being_corrupted]:[original_value][operation][modifier]=[corrupt_byte_value]" as it goes so you can use shell redirection to save a copy of the changes made:
`pdcorrupter.pl [options] > recipe`
Also, if it wasn't clear already, the input file will remain completely unchanged, all modifications are stored in a perl array beforing being wrote to `outputfilename`.
## About
As you may have guessed, from format of the option and the example file 'a_game.rom', the primary use of this script is to corrupt ROMs for some surreal, and occassionally confounding, fun and that its design was inspired by the VineSauce ROM corrupter. I wanted something that behaved similarly but was usable from a shell and not slogged down by a clunking Windows UI. A reasonable request, I thought, but when searched around, I couldn't find a data corrupter I liked: so I wrote my own which can easily be used in a "one-liner" shell command to corrupt and then play a ROM like so:
`pdcorrupter.pl -i n.rom -sta 1000 -e 4000 -ste 2 -o cor.rom > rec && emulator cor.rom`
The name PDcorrupter.pl can stand for "Perlish Data Corrupter" or "Public Domain Corrupter"; the latter of which invokes its license.
I've only spoken about its ROM corrupting capabilities but, really, it can be used for all kinds of data corrupting necessities: for example, testing how your software handles corrupt image files. 
