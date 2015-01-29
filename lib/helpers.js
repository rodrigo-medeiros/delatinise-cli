var fs = require('fs'),
    path = require('path'),
		S = require('string'),
    async = require('async'),
    iconv = require('iconv-lite'),
		mmm = require('mmmagic'),
		Magic = mmm.Magic;

function Delatinise (options, done) {

  this.keepOriginal = options.delete;
  this.encoding = options.encoding;
  this.filePath = options.filePath;

  return this;
}

Delatinise.prototype.validatePath = function (done) {
  var self = this;

  fs.exists(self.filePath, function (exists) {
    if (!exists) return done(false);
    done(true);
  });
};

Delatinise.prototype.run = function (done) {
  var self = this;

  async.series({

    validatePath: function (callback) {

      self.validatePath(function (isValid) {
        if (!isValid) return callback("Path/file " + filePath + " doesn't exist.");
        callback();
      });
    }

  }, function (error, result) {
    if (error) return done("An error has ocurred: " + error);
    done();
  });
};

module.exports = Delatinise;
