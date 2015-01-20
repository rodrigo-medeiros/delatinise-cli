var fs = require('fs'),
    path = require('path'),
    async = require('async');

exports.delatinise = function (options, done) {

  var keepOriginal = options.delete,
      encoding = options.encoding,
      filePath = options.filePath;

  async.series({

    validatePath: function (callback) {
      validatePath(filePath, function (isValid) {
        if (!isValid) return callback("Path/file " + filePath + " doesn't exist.");
        callback();
      });
    }

  }, function (error, result) {
    if (error) return done("An error has ocurred: " + error);
    done();
  });
};

function validatePath (filePath, callback) {
  fs.exists(filePath, function (exists) {
    if (!exists) return callback(false);
    callback(true);
  });
}

exports.fetchFilePaths = function (filePath, done) {
  var isFile = false,
      filePaths = [];

  async.series({

    exists: function (callback) {
      fs.exists(filePath, function (exists) {
        if (!exists) return callback("Path/file " + filePath + " doesn't exist.");
        callback();
      });
    },

    fileOrDir: function (callback) {
	    fs.stat(filePath, function (error, stats) {
        if (error) return callback("An error occurred while getting path info: " + error);
        if (stats.isFile()) isFile = true;
        callback();
      });
    },

    getPaths: function (callback) {
      if (isFile) {
        filePaths.push(filePath);
        callback();
      } else {
        fs.readdir(filePath, function (error, files) {
          if (error) return callback("An error occured while reading from directory " + filePath + ": " + error);
          files.forEach(function (file) {
            filePaths.push(path.join(filePath, file));
          });
          callback();
        });
      }
    }

  }, function (error, results) {
    if (error) return done(error);
    done(null, filePaths);
  });
};
