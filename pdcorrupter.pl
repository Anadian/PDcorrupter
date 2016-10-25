#!/usr/bin/perl
use strict;
use warnings;
use Getopt::Long;
my $inputfilename = '';
my $startbyte = 64;
my $endbyte = 0;
my $step = 2;
my $magnitude = 128;
my $outputfilename = 'cor';
my $help;
GetOptions("inputfilename=s", \$inputfilename,
	"startbyte=i", \$startbyte,
	"endbyte=i", \$endbyte,
	"step=i", \$step,
	"magnitude=i", \$magnitude,
	"outputfilename=s", \$outputfilename,
	"help", \$help);
if(!$inputfilename){
	print('Insufficient arguments');
	$help = 1;
}
if($help){
	print(q{`pdcorrupter.pl [options]`
It takes the following options:
* `inputfilename [filename]`: The file you'd like to corrupt. e.g. 'a_game.rom'

* `startbyte [byte]`: A **decimal** number specifying the byte to begin corrupting on; useful for avoiding headers. e.g. `1000` to begin corruption on the first kilobyte. 

* `endbyte [byte]`: A decimal number specifying where it should stop corrupting. e.g. a `startbyte` of `5000` and an `endbyte` of `5005000` would specify a range of 5 MB or, to put it another way, from 1 KB to 5005 KB.

* `step [bytes]`: The interval, on which, it will corrupt a byte. e.g. A value of `2` would corrupt every other byte, while `256` will corrupt every 256'th byte, and so on.

* `outputfilename [filename]`: The file to save the the corrupted output to. e.g. 'a_corrupted_game.rom'

* `magnitude [unsigned 8-bit integer]`: The maximum factor by which a byte can be modified: a lower number for a less severe corruption and a higher number for a more severe, more polarizing, corruption. Defaults to 128.});

	die;
}
my $filehandle;
open($filehandle, "+<:bytes", $inputfilename);
my @bytes;
while(my $filebyte = <$filehandle>){
	my $byte;
	for(my $i = 0; $i < length($filebyte); $i++){
		$byte = unpack('C',substr($filebyte,$i,1));
		push(@bytes,($byte%256));
	}
}
print("$inputfilename:$#bytes:$startbyte:$endbyte:$step:$outputfilename\n");
close($filehandle);
#format:filename.:sizeinbytes:startbyte:endbyte:bytestep:validoperands:absolutemagnitude
my $size = $#bytes;
if($endbyte == 0){
	 $endbyte = $size;
}
for(my $i = $startbyte; $i < $endbyte; $i += $step){
	my $operand = (int(rand(5)));
	my $modifer = int(rand($magnitude)+1);
	print("$i:$bytes[$i]");
	if($operand == 0){ 
		$bytes[$i] += $modifer;
		print("+$modifer");
	 } elsif($operand == 1){ 
		$bytes[$i] -= $modifer;
		print("-$modifer");
	 } elsif($operand == 2){ 
		$bytes[$i] *= $modifer;
		print("*$modifer");
	 } elsif($operand == 3){ $bytes[$i] /= $modifer;
		print("/$modifer");
	 } elsif($operand == 4){
		$bytes[$i] %= $modifer;
		print("%$modifer");
	 }
	$bytes[$i] %= 256;
	print("=$bytes[$i]\n");
}
my $fileout;
open($fileout, ">:bytes", $outputfilename);
for(my $i = 0; $i < $#bytes; $i++){
	my $byte = pack('C',$bytes[$i]);
	print{$fileout}($byte);
}
close($fileout);
