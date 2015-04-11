var fs = require('fs'),
    path = require('path'),
    S = require('string'),
    async = require('async'),
    mmm = require('mmmagic'),
    Magic = mmm.Magic;

function Delatinise (options, done) {

  this.path = options.filePath;
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
      getFileInfo(self.path, function (error, fileInfo) {
        if (error) return done(error);
        if (fileInfo.type === 'text/plain') self.files.push(self.path);
        done();
      });
    } else {
      fs.readdir(self.path, function (error, files) {
        if (error) return done(error);

        async.each(files, function (file, callback) {
          var filePath = path.join(self.path, file);

            getFileInfo(filePath, function (error, fileInfo) {
              if (error) return done(error);
              if (fileInfo.type === 'text/plain') self.files.push(filePath);
              callback();
            });

        }, function (error) {
          if (error) return done(error);
          done();
        });
      });
    }
  });

};

var convertFiles = function (done) {
  var self = this;

  async.each(self.files, function (file, callback) {

    var writeStream = fs.createWriteStream(newFileName(file));

    fs.createReadStream(file)
      .on('data', function (chunk) {
        writeStream.write(S(chunk.toString()).latinise().s);
      })
      .on('end', function () {
        writeStream.end(callback);
      });

  }, function (error) {
    if (error) return done(error);
    done();
  });
};

var getFileInfo = function (filePath, done) {
  var magic = new Magic(mmm.MAGIC_MIME_TYPE),
      fileInfo = {};

  magic.detectFile(filePath, function (error, results) {
    if (error) return done(error);

    results = results.split(';');
    fileInfo.type = results[0];

    done(null, fileInfo);
  });
};

var newFileName = function (fileName) {
  var parsed = path.parse(fileName);
  return path.join(parsed.dir, parsed.name + "_NEW" + parsed.ext);
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
          message: "Directory/file '" + self.path + "' doesn't exist."
        });
        callback(null, true);
      });
    },

    fetchFiles: function (callback) {

      fetchFiles.call(self, function (error) {
        if (error) return callback({
          message: "An error ocurred while fetching the file(s): " + error
        });
        callback();
      });
    },

    convertFiles: function (callback) {

      convertFiles.call(self, function (error, converted) {
        if (error) return callback({
          message: "An error ocurred while converting the file(s): " + error
        });
        callback(null, converted);
      });
    }

  }, function (error, result) {
    if (error) return done(error.message);
    done();
  });
};

module.exports = Delatinise;
