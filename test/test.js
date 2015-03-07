var expect = require('expect.js'),
    exec = require('child_process').exec;

describe("CLI", function () {
  beforeEach(function (done) {
    copyFiles(done);
  });

  afterEach(function (done) {
    removeFilesAndDir(done);
  });

  describe("When a valid file is passed", function () {

    it("should process the file and return a confirmation message", function (done) {

      exec("delatinise ./test/with-latin-chars.txt", function (error, stdout, stderr) {
        if (error) return done(error);
        expect(stdout).to.equal("All files have been successfully processed.\n");
        done();
      });

    });

  });

  describe("When an invalid file is passed", function () {

    it("should not process the file and return an error message", function (done) {

      exec("delatinise ./foo/bar/invalid-file.txt", function (error, stdout, stderr) {
        if (error) return done(error);
        expect(stdout).to.equal("Directory/file ./foo/bar/invalid-file.txt doesn't exist.\n");
        done();
      });

    });

  });

  describe("When no path is passed", function () {

    it("should process all .txt files inside current dir and return a confirmation message", function (done) {
      done();
    });

  });

});

function copyFiles (done) {
  exec("cp ./test/files/with-latin-chars.txt ./test/;", function (error, stdout, sdterr) {
    if (error) return done(error);
    done();
  });
}

function removeFilesAndDir (done) {
  exec("rm -rf ./test/backup; rm -f ./test/*.txt", function (error, stdout, sdterr) {
    if (error) return done(error);
    done();
  });
}
