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

  return this;
}

var validatePath = function (filePath, done) {

  fs.exists(filePath, function (exists) {
    if (!exists) return done(false);
    done(true);
  });

};

var convertFiles = function (filePath, done) {

  fs.stat(filePath, function (error, stats) {
    if (error) return done(error);

    if (stats.isFile()) {
      var magic = new Magic(mmm.MAGIC_MIME_TYPE | mmm.MAGIC_MIME_ENCODING);

      magic.detectFile(filePath, function (error, results) {
        if (error) return done(error);

        results = results.split(';');

        done();
      });
    }
  });

};

Delatinise.prototype.run = function (done) {
  var self = this;

  async.series({

    validatePath: function (callback) {

      validatePath(self.path, function (isValid) {
        if (!isValid) return callback({
          message: "Directory/file " + self.path + " doesn't exist."
        });
        callback(null, true);
      });
    },

    convertFiles: function (callback) {

      convertFiles(self.path, function (error, converted) {
        if (error) return callback({
          message: "An error ocurred while converting the file(s)."
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
