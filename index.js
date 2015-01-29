#!/usr/bin/env node
var Delatinise = require('./lib/delatinise'),
		program = require('commander');

program
	.version('0.1.0')
	.description("A CLI tool to remove accents from text files.")
	.usage('[options] <path>')
	.option('-d, --delete', "Delete original files.")
	.option('-e, --encoding [type]', "The desired encoding output [utf8].", 'utf8')
	.parse(process.argv);

var options = {
  delete: program.delete,
  encoding: program.encoding,
  filePath: program.args.length ? program.args[0] : './'
};

var delatinise = new Delatinise(options);

delatinise.run(function (error) {
  if (error) console.log(error);
  else console.log("All files have been successfully processed.");
});
