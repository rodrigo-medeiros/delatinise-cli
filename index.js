#!/usr/bin/env node

var util = require('./lib/util'),
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

var filePaths = program.args.length ? program.args : [ './' ];

async.each(filePaths, util.processFiles, function (error) {
  if (error) console.log(error);
  else console.log("All files have been successfully processed.");
});
