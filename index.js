#!/usr/bin/env node

var helpers = require('./lib/helpers'),
		S = require('string'),
		program = require('commander'),
		async = require('async'),
		iconv = require('iconv-lite'),
		mmm = require('mmmagic'),
		Magic = mmm.Magic;


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

helpers.delatinise(options, function (error) {
  if (error) console.log(error);
  else console.log("All files have been successfully processed.");
});
