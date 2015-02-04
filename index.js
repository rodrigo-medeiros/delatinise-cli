#!/usr/bin/env node
var Delatinise = require('./lib/delatinise'),
		program = require('commander');

program
	.version('0.1.0')
	.description("A CLI tool to remove accents from text files.")
	.usage('[options] <path>')
	.option('-e, --encoding [type]', "The desired encoding output [utf8].", 'utf8')
	.parse(process.argv);

var options = {
  delete: program.delete,
  encoding: program.encoding,
  filePath: program.args[0]
};

var delatinise = new Delatinise(options);

delatinise.run(function (error) {
  if (error) process.stdout.write(error + "\n");
  else process.stdout.write("All files have been successfully processed.\n");
});
