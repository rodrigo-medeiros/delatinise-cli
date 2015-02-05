var fs = require('fs'),
    path = require('path'),
		S = require('string'),
    async = require('async'),
    mv = require('mv'),
    iconv = require('iconv-lite'),
		mmm = require('mmmagic'),
		Magic = mmm.Magic;

function Delatinise (options, done) {

  this.keepOriginal = options.delete;
  this.encoding = options.encoding;
  this.path = options.filePath || './';
  this.isFile = false;
  this.files = [];

  return this;
}

var validatePath = function (done) {
  var self = this;

  fs.exists(self.path, function (exists) {
    if (!exists) return done(null, false);

    fs.stat(self.path, function (error, stats) {
      if (error) return done(error);

      if (stats.isFile()) self.isFile = true;
      done(null, true);
    });
  });

};

var fetchFiles = function (done) {
  var self = this;

  fs.stat(self.path, function (error, stats) {
    if (error) return done(error);

    if (stats.isFile()) {
      isTextFile(self.path, function (error, isTextFile) {
        if (error) return done(error);
        if (isTextFile) self.files.push(self.path);
        done();
      });
    } else {
      fs.readdir(self.path, function (error, files) {
        if (error) return done(error);

        async.each(files, function (file, callback) {
          
        }, function (error) {
          if (error) return done(error);
        });
      });
    }
  });

};

var isTextFile = function (filePath, done) {
  var magic = new Magic(mmm.MAGIC_MIME_TYPE | mmm.MAGIC_MIME_ENCODING);

  magic.detectFile(filePath, function (error, results) {
    if (error) return done(error);

    results = results.split(';');
    if (results[0] === 'text/plain') return done(null, true);
    return done(null, false);
  });
};

Delatinise.prototype.run = function (done) {
  var self = this;

  async.series({

    validatePath: function (callback) {

      validatePath.call(self, function (error, isValid) {
        if (error) return callback({
          message: "An error ocurred while validating the path."
        });

        if (!isValid) return callback({
          message: "Directory/file " + self.path + " doesn't exist."
        });
        callback(null, true);
      });
    },

    fetchFiles: function (callback) {

      fetchFiles.call(self, function (error, converted) {
        if (error) return callback({
          message: "An error ocurred while fetching the file(s)."
        });
        callback(null, true);
      });
    }

  }, function (error, result) {
    if (error) return done("An error has ocurred: " + error.message);
    done();
  });
};

module.exports = Delatinise;
