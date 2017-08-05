#!/usr/local/bin/node
var FileSystem = require('fs');
var CommandLineArgs = require('command-line-args');

const Options = [
	{name: 'random', alias: 'r', type: Boolean, description: 'Enable random mode.'},
	{name: 'repeat', alias: 'R', type: String, description: 'Repeat a previously a previously saved (-S <file>) corruption diff.'},
	{name: 'input', alias: 'I', type: String, description: 'The name of the file to be corrupted.'},
	{name: 'output', alias: 'O', type: String, description: 'Name of the corrupted file.'},
	{name: 'start', alias: 's', type: Number, description: 'The byte to begin corrupting on.'},
	{name: 'save', alias: 'S', type: String, description: 'Save a corruption diff which can later be repeated (-R <file>).'},
	{name: 'end', alias: 'e', type: Number, description: 'The byte to stop corrupting on.'},
	{name: 'step', alias: 'c', type: Number},
	{name: 'mode', alias: 'm', type: String},
	{name: 'magnitude', alias: 'M', type: Number},
	{name: 'count', alias: 'n', type: Boolean}
];
const OptionResults = CommandLineArgs(Options);
console.log(OptionResults);
if(OptionResults.input != null){
	var input_filename = OptionResults.input;
	console.log('Input: ', input_filename);
	var output_filename;
	if(OptionResults.output == null){
		console.log('No output specified.');
		output_filename = "cor_"+(input_filename);
	} else output_filename = OptionResults.output;
	console.log('Output: ', output_filename);
	var random_mode;
	if(OptionResults.random == true){
		console.log('Random mode initiated.');
		random_mode = true;
	} else random_mode = false;
	
	var file_data = FileSystem.readFileSync(input_filename);
	var file_length = file_data.length;
	console.log('Length in bytes: ', file_length);
	if(OptionResults.count != true){
		var start_byte;
		if(OptionResults.start != null) start_byte = OptionResults.start;
		else if(random_mode == true) start_byte = Math.floor(Math.random() * (file_length / 2));
		else start_byte = 0;
		console.log('Start byte: ', start_byte);
		var end_byte;
		if(OptionResults.end != null && OptionResults.end < file_length) end_byte = OptionResults.end;
		else if(random_mode == true) end_byte = Math.floor((Math.random() * (file_length / 2)) + (file_length / 2));
		else end_byte = file_length;
		console.log('End byte: ', end_byte);
		var step;
		if(OptionResults.step != null && OptionResults.step < file_length) step = OptionResults.step;
		else if(random_mode == true) step = (Math.floor(Math.random() * 32) + 1);
		else step = 2;
		console.log('Step: ', step);
		var mode;
		if(OptionResults.mode != null && typeof(OptionResults.mode) === 'string'){
			if(OptionResults.mode.startsWith('+')) mode = '+';
			else if(OptionResults.mode.startsWith('-')) mode = '-';
			else if(OptionResults.mode.startsWith('*')) mode = '*';
			else if(OptionResults.mode.startsWith('/')) mode = '/';
			else if(OptionResults.mode.startsWith('%')) mode = '%';
			else if(OptionResults.mode.startsWith('?') || random_mode) mode = '?';
			else mode = '+';
		} else mode = '+';
		console.log("Mode: ", mode);
		for(var i = start_byte; i < end_byte; i += step){
			var temp_mode;
			if(mode === '?') temp_mode = '+-*/%'.charAt(Math.floor(Math.random() * 6));
			else temp_mode = mode;
			var magnitude;
			if(OptionResults.magnitude != null && typeof(OptionResults.magnitude) === 'number') magnitude = Math.floor(OptionResults.magnitude);
			else if(random_mode) magnitude = Math.floor(Math.random() * 128);
			else magnitude = 2;
			console.log("%d%s%d", i, temp_mode, magnitude);
			var new_byte;
			switch(temp_mode){
				case '+': new_byte = Math.floor(file_data.readUInt8(i) + magnitude); break;
				case '-': new_byte = Math.floor(file_data.readUInt8(i) - magnitude); break;
				case '*': new_byte = Math.floor(file_data.readUInt8(i) * magnitude); break;
				case '/': new_byte = Math.floor(file_data.readUInt8(i) / magnitude); break;
				case '%': new_byte = Math.floor(file_data.readUInt8(i) % magnitude); break;
				default: new_byte = file_data.readUInt8(i); break;
			}
			console.log("new byte: ", new_byte);
			file_data.writeUInt8(new_byte, i);
		}
		FileSystem.writeFileSync(output_filename, file_data);
	}
}
