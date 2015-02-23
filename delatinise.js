#!/usr/bin/env node
var Delatinise = require('./lib/delatinise'),
		program = require('commander');

program
	.version('0.1.0')
	.description("A CLI tool to remove accents from text files.")
	.usage('<path>')
	.parse(process.argv);

var options = {
  filePath: program.args[0]
};

var delatinise = new Delatinise(options);

delatinise.run(function (error) {
  if (error) process.stdout.write(error + "\n");
  else process.stdout.write("All files have been successfully processed.\n");
});
