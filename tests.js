'use strict';
var should = require('should');
var toobusy = require('./');

/*global describe, it, beforeEach, afterEach */
describe('the library', function() {
  it('should export a couple functions', function() {
    (toobusy).should.be.a('function');
    (toobusy.maxLag).should.be.a('function');
    (toobusy.shutdown).should.be.a('function');
    (toobusy.interval).should.be.a('function');
    (toobusy.shutdown).should.be.a('function');
    (toobusy).should.not.have.property('start');
  });
});

describe('maxLag', function() {
  it('should default to 70', function() {
    (toobusy.maxLag()).should.equal(70);
  });
  it('should throw an exception for values < 10', function() {
    (function() { toobusy.maxLag(9); }).should.throw;
  });
  it('should be configurable', function() {
    (toobusy.maxLag(50)).should.equal(50);
    (toobusy.maxLag(10)).should.equal(10);
    (toobusy.maxLag()).should.equal(10);
  });
});

describe('interval', function() {
  it('should default to 500', function() {
    (toobusy.interval()).should.equal(500);
  });
  it('should throw an exception for values < 16', function() {
    (function() { toobusy.interval(15); }).should.throw;
  });
  it('should be configurable', function() {
    (toobusy.interval(250)).should.equal(250);
    (toobusy.interval(300)).should.equal(300);
    (toobusy.interval()).should.equal(300);
  });
});

describe('toobusy()', function() {
  // Set lower thresholds for each of these tests.
  // Resetting the interval() also resets the internal lag counter, which
  // is nice for making these tests independent of each other.
  beforeEach(function() {
    toobusy.maxLag(10);
    toobusy.interval(250);
  });
  afterEach(function() {
    toobusy.maxLag(70);
    toobusy.interval(500);
  });
  it('should return true after a little load', function(done) {
    function load() {
      if (toobusy()) return done();
      var start = new Date();
      while ((new Date() - start) < 100) {
        for (var i = 0; i < 1e5;) i++;
      }
      setTimeout(load, 100);
    }
    load();
  });

  it('should return a lag value after a little load', function(done) {
    function load() {
      if (toobusy()) {
        var lag = toobusy.lag();
        should.exist(lag);
        lag.should.be.above(1);
        return done();
      }
      var start = new Date();
      while ((new Date() - start) < 100) {
        for (var i = 0; i < 1e5;) i++;
      }
      setTimeout(load, 0);
    }
    load();
  });
});

