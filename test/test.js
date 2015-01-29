var Delatinise = require('../lib/helpers'),
    expect = require('expect.js');

describe("validatePath:", function () {

  describe("When a valid path is passed", function () {

    it("should return true", function (done) {
      var options = {
        filePath: "./"
      };
      var delatinise = new Delatinise(options);
      delatinise.validatePath(function (isValid) {
        expect(isValid).to.be(true);
        done();
      });
    });

  });

  describe("When an invalid path is passed", function () {

    it("should return false", function (done) {
      var options = {
        filePath: "./foo/bar"
      };
      var delatinise = new Delatinise(options);
      delatinise.validatePath(function (isValid) {
        expect(isValid).to.be(false);
        done();
      });
    });

  });

});
