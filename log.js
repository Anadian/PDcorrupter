#!/usr/local/bin/node
/**
*	@file source/log.js
*	@author Anadian
*	@copyright MIT License:
	Copyright 2017 Canosw
	Permission is hereby granted, free of charge, to any person obtaining a copy of this 
software and associated documentation files (the "Software"), to deal in the Software 
without restriction, including without limitation the rights to use, copy, modify, 
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to 
permit persons to whom the Software is furnished to do so, subject to the following 
conditions:
	The above copyright notice and this permission notice shall be included in all copies 
or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const Utility = require('util');
const FileSystem = require('fs');
const Chalk = require('chalk');

var date = new Date();
var LogConsole = {
	enabled: true,
	stream: 'stderr',
	colour: true,
	level: 'info'
};
var LogFile = {
	enabled: true,
	filename: date.toISOString().replace(/[-:\.]/g, '')+'.log',
	level: 'debug'
};

function appendFile_Callback(error){ 
	if(error != null) console.error('AppendFile error: ', error);
}

function Log(process_name, module_name, file_name, function_name, level_name, message){
	var _return = null;
	var date = new Date();
	if(arguments.length > 6){
		for(var i = 6; i < arguments.length; i++){
			message += ('|'+Utility.inspect(arguments[i]));
		}
	}
	date.toISOString()+' '+process_name+':'+module_name+':'+file_name+':'+function_name+':'+level_name+': '+message;
	if(LogFile.enabled == true){
		FileSystem.appendFile(LogFile.filename, date.toISOString()+' '+process_name+':'+module_name+':'+file_name+':'+function_name+':'+level_name+': '+message+'\n', 'utf8', function appendFile_Callback(error){ if(error != null) console.error('AppendFile error: ', error);});
	}
	if(LogConsole.enabled == true){
		var colour;
		switch(level_name){
			//silent
			case 'error': colour = Chalk.red; break;
			//quiet
			case 'warn': colour = Chalk.yellow; break;
			case 'note': colour = Chalk.magenta; break;
			case 'info': colour = Chalk.blue; break;
			//normal
			case 'debug': colour = Chalk.green; break;
			//verbose
			default: colour = function no_colour(){ return arguments; }; break;
		}
		var string = colour(Utility.format("%s:%s:%s: %s", Chalk.bold(level_name), Chalk.dim(module_name), Chalk.underline(function_name), message));
		console.error(string);
	}
	return _return;
}
function Log_Test(){
	Log(process.argv0, 'test', __filename, arguments.callee.name, 'error', 'yo', LogConsole, LogFile);
	Log(process.argv0, 'test', __filename, arguments.callee.name, 'warn', 'yo', LogConsole, LogFile);
	Log(process.argv0, 'test', __filename, arguments.callee.name, 'note', 'yo', LogConsole, LogFile);
	Log(process.argv0, 'test', __filename, arguments.callee.name, 'info', 'yo', LogConsole, LogFile);
	Log(process.argv0, 'test', __filename, arguments.callee.name, 'debug', 'yo', LogConsole, LogFile);
}

if(require.main === module){
	Log_Test();
} else{
	exports.log = Log;
	exports.test = Log_Test;
}

