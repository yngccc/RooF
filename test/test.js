var request = require('request')
, assert = require('assert')
, app = require('../app');

describe("authentication", function() {
    describe("GET /login", function() {
	var body = null;
	before(function(done) {
	    var options = {uri : "http://localhost:3000/secret"};
	    request(options, function(err, response, _body) {
		body = _body
		done();
	    });
	});
	it("has should show access denied", function() {
	    assert.equal(body, "Access Denied");
	});
    });
});