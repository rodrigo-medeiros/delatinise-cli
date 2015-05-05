var fs = require('fs'),
    path = require('path'),
    S = require('string'),
    async = require('async'),
    iconv = require('iconv-lite'),
    mmm = require('mmmagic'),
    Magic = mmm.Magic;

var DIR = 'delatinised';

function Delatinise (options) {

  var internals = {

    origin: {
      path: options.path,
      isFile: false 
    },
    destination: undefined
  };

  function getOrigin () {

    return internals.origin.path;
  }

  function setDestination (destination) {

    internals.destination = destination;
  }

  function getDestination () {

    return internals.destination;
  }

  function originIsFile (isFile) {

    var current = internals.origin.isFile;
    internals.origin.isFile = isFile || current;
    return internals.origin.isFile;
  }

  function createDirectory (destination, done) {

    fs.exists(destination, function (exists) {

      if (!exists) {
        fs.mkdir(destination, function (error) {
          if (error) return done({
            message: "An error ocurred while creating " + destination + " directory: " + error
          });
          done();
        });
      } else {
        done();
      }
    });
  }

  function initialize (done) {

    var origin = getOrigin(),
        destination;

    fs.exists(origin, function (exists) {

      if (!exists) return done({
        message: "Directory/file '" + origin + "' doesn't exist."
      });

      fs.stat(origin, function (error, stats) {
        if (error) return done({
          message: "An error ocurred while initializing the tool: " + error
        });

        if (stats.isFile()) {
          originIsFile(true);
          destination = path.join(path.dirname(origin), DIR);
        } else {
          destination = path.join(origin, DIR);
        } 
        setDestination(destination);

        createDirectory(destination, function (error) {
          if (error) return done(error);
          done();
        });
      });
    });
  }

  function getFileInfo (file, done) {

    var magic = new Magic(mmm.MAGIC_MIME_TYPE | mmm.MAGIC_MIME_ENCODING);

    magic.detectFile(file, function (error, result) {
      if (error) return done(error);

      var mime = result.split(';'),
          mimeType = mime[0];
          charset = mime[1].split('=')[1];

      if (mimeType === 'text/plain') {
        var fileInfo = {
          path: file,
          charset: charset
        };

        done(fileInfo);
      } else {
        done();
      }
    });
  }

  function fetchFiles (done) {

    var origin = getOrigin(),
        filesList = [];

    if (originIsFile()) {
      getFileInfo(origin, function (fileInfo) {
        if (fileInfo) {
          filesList.push(fileInfo);
          done(null, filesList);
        }
      });

    } else {
      fs.readdir(origin, function (error, files) {
        if (error) return done(error);

        async.each(files, function (file, callback) {
          var filePath = path.join(origin, file);
            
          getFileInfo(filePath, function (fileInfo) {
            if (fileInfo) {
              filesList.push(fileInfo);
            }
            callback();
          });

        }, function (error) {
          if (error) return done(error);
          done(null, filesList);
        });
      });
    }
  }

  function convertFiles (files, done) {

    async.eachSeries(files, function (file, callback) {

      var writeStream = fs.createWriteStream(path.join(getDestination(), path.basename(file.path)));
      process.stdout.write('Converting file ' + file.path + ': ');
 
      iconv.extendNodeEncodings();

      if (file.charset !== 'utf8') {

        fs.createReadStream(file.path)
          .pipe(iconv.decodeStream(file.charset))
          .pipe(iconv.encodeStream('utf8'))
          .on('data', function (chunk) {
            writeStream.write(S(chunk.toString()).latinise().s);
          })
          .on('end', function () {
            process.stdout.write('done!\n');
            writeStream.end(callback);
          })
          .on('error', function (error) {
            process.stdout.write(' not ok - ' + error);
          });

      }

    }, function (error) {
      if (error) return done(error);
      done();
    });
  }

  this.run = function (done) {

    async.waterfall([

      function (callback) {
        initialize(callback);
      },

      function (callback) {
        fetchFiles(callback);
      },

      function (files, callback) {
        convertFiles(files, callback);
      }

    ], function (error, result) {
      if (error) return done(error.message);
      done();
    });
  };

  return this;
}

module.exports = Delatinise;
