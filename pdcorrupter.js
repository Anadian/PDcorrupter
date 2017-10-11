#!{/usr/local/bin/node} || {/usr/bin/env node}
const FileSystem = require('fs');
const CommandLineArgs = require('command-line-args');
const CommandLineUsage = require('command-line-usage');

const OptionDefinitions = [
	{name: 'begin', alias: 'B', type: Number, description: 'The byte to begin corrupting on.'},
	{name: 'count', alias: 'n', type: Boolean, description: 'Display the input files\'s length in bytes and exit.'}
	{name: 'end', alias: 'E', type: Number, description: 'The byte to stop corrupting on.'},
	{name: 'force', alias: 'f', type: Boolean, description: 'Overwrite the output file if it already exist.'},
	{name: 'help', alias: 'h', type: Boolean, description: 'Display this help text and exit.'},
	{name: 'input', alias: 'I', type: String, description: 'Name of the input file to read data from.'},
	{name: 'magnitude', alias: 'M', type: Number},
	{name: 'mode', alias: 'm', type: String},
	{name: 'output', alias: 'O', type: String, description: 'The output file to write the corrupted data.'
	{name: 'quiet', alias: 'q', type: Boolean, decsription: 'Only log errors.'},
	{name: 'random', alias: 'r', type: Boolean, description: 'Enable random mode.'},
	{name: 'repeat', alias: 'R', type: String, description: 'Repeat a previously a previously saved (-S <file>) corruption diff.'},
	{name: 'save', alias: 'S', type: String, description: 'Save a corruption diff which can later be repeated (-R <file>).'},
	{name: 'silent', alias: 's', type: Boolean, description: 'Silence logging.'},
	{name: 'stderr', alias: 'e', type: String, description: 'Redirect stderr to the given destination.'},
	{name: 'stdin', alias: 'i', type: Boolean, description: 'Read input data from stdin.'},
	{name: 'stdout', alias: 'o', type: String, description: 'Redirect stdout to the given destination.'},
	{name: 'step', alias: 'c', type: Number, description: 'Number of bytes to skip per corruption.'},
	{name: 'verbose', alias: 'v', type: Boolean, description: 'Verbose logging.'},
	{name: 'version', alias: 'V', type: Boolean, description: 'Display version information and exit.'},
];
const UsageSections = [
	{
		header: 'pdcorrupter',
		content: 'A simple-stupid file/ROM corrupter.'
	},
	{
		header: 'Options',
		optionList: OptionDefinitions
	}
];
const OptionResults = CommandLineArgs(OptionDefinitions); 
console.log(OptionResults);
if(OptionResults.help != null){
	console.log(CommandLineUsage(UsageSections));
} else{
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
				} else if(random_mode) mode = '?';
				else mode = '+';
				console.log("Mode: ", mode);
				for(var i = start_byte; i < end_byte; i += step){
					var temp_mode;
					if(mode === '?') temp_mode = '+-*/%'.charAt(Math.floor(Math.random() * 5));
					else temp_mode = mode;
					var magnitude;
					if(OptionResults.magnitude != null && typeof(OptionResults.magnitude) === 'number') magnitude = Math.floor(OptionResults.magnitude);
					else if(random_mode) magnitude = (Math.floor(Math.random() * 128)+1);
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
					new_byte = Math.abs(new_byte % 256);
					console.log("new byte: ", new_byte);
					file_data.writeUInt8(new_byte, i);
				}
				FileSystem.writeFileSync(output_filename, file_data);
			}
		}
}
