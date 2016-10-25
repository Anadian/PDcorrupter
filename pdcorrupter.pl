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
GetOptions("inputfilename=s", \$inputfilename,
	"startbyte=i", \$startbyte,
	"endbyte=i", \$endbyte,
	"step=i", \$step,
	"magnitude=i", \$magnitude,
	"outputfilename=s", \$outputfilename);
if(!$inputfilename){
	print('Insufficient arguments');
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
