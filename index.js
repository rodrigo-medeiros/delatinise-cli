#!/usr/bin/env node
var Delatinise = require('./lib/delatinise'),
    program = require('commander'),
    path = require('path'),
    version = require('./package.json').version;

program
  .version(version)
  .description("A CLI tool to remove accents from text files.")
  .usage('<path>')
  .parse(process.argv);

var options = {

  path: program.args[0]
};

if (!options.path) {

  return program.help();
}

var delatinise = new Delatinise(options);

setTimeout(function () {

  delatinise.run(function (error) {

    if (error) process.stdout.write(error + "\n");
    else process.stdout.write("All files have been successfully processed.\n");
  });
}, 1000);
