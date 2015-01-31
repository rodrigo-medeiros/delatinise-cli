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
  this.stats = {
    path:  options.filePath || './',
    isFile: false
  };

  return this;
}

var validatePath = function (done) {
  var self = this;

  fs.exists(self.stats.path, function (exists) {
    if (!exists) return done(false);
    done(true);
  });
};

var setStats = function (done) {
  var self = this;

  fs.stat(self.stats.path, function (error, stats) {
    if (error) return done(error);

    self.stats.isFile = stats.isFile();
    done(null, self.stats);
  });
};

var createBackup = function (done) {
  var self = this,
      backupFiles = [];

  if (self.stats.isFile) {
    var destination = path.join(path.dirname(self.stats.path), 'backup', path.basename(self.stats.path));

    mv(self.stats.path, destination, { mkdirp: true }, function (error) {
      if(error) return done(error);
      done();
    });
  }
};

Delatinise.prototype.run = function (done) {
  var self = this;

  async.series({

    validatePath: function (callback) {

      validatePath.call(self, function (isValid) {
        if (!isValid) return callback({
          method: 'validatePath',
          message: "Path/file " + self.stats.path + " doesn't exist."
        });
        callback(null, true);
      });
    },

    setStats: function (callback) {

      setStats.call(self, function (error, stats) {
        if (error) return callback({
          method: 'setStats',
          message: error
        });
        callback(null, stats);
      });
    },

    createBackup: function (callback) {

      createBackup.call(self, function (error) {
        if (error) return callback({
          method: 'createBackup',
          message: error
        });
        callback(null, 'ok');
      });
    }

  }, function (error, result) {
    if (error) return done("An error has ocurred: " + error.message);
    done();
  });
};

module.exports = Delatinise;
