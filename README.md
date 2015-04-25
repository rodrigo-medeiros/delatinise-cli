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

The path can be a file or directory. It will create a folder called __delatinised__ and put all processed files in it.

## Encoding

`delatinise-cli` tries to figure out the encoding of the files you want to treat. By default, it converts them to **UTF-8**, since after the conversion, we don't have accents any more.

## Race Conditions

The conversion process, by its nature, is susceptible to race conditions. So it is possible that a file converted by `delatinise-cli` and put into the __delatinised__ folder may have been deleted or modified by the time the execution is finished.

**Note:** To execute the accent removal task, we use the [string.js](http://stringjs.com) [`latinise()`](http://stringjs.com/#methods/latinise) method.

## License

Licensed under the [MIT License](https://github.com/rodrigo-medeiros/delatinise-cli/blob/master/LICENSE)
