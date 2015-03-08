# delatinise-cli
[![Build Status](https://travis-ci.org/rodrigo-medeiros/delatinise-cli.svg?branch=0.1.2)](https://travis-ci.org/rodrigo-medeiros/delatinise-cli)
> A CLI tool to remove accents from text files.

Install this globally and you'll have access to this tool anywhere on your system.

```shell
npm install -g delatinise-cli
```

To run it:
```shell
delatinise <path>
```

The path can be a file or directory. If no path is specified, the tool is going to look for text files in the current directory.

**Note:** this tool uses the [string.js](http://stringjs.com) [`latinise()`](http://stringjs.com/#methods/latinise) method to execute the accent removal task.
