var expect = require('chai').expect;

var splnkstrm = require('../');

describe('splnkstrm', function() {
    var s;

    before(function() {

    });

    it('should throw if no apiKey is set', function() {
        expect(function() {
            new splnkstrm({projectId: 'foo'});
        }).to.throw();
    });

    it('should throw if no projectId is set', function() {
        expect(function() {
            new splnkstrm({apiKey: 'foo'});
        }).to.throw();
    });

});