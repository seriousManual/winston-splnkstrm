var expect = require('chai').expect;
var sandboxed = require('sandboxed-module');
var sinon = require('sinon');

var splnkstrm = require('../');

function getSplunkstormMock() {
    return {
        Log: sinon.spy(function(apiKey, projectId) {

        })
    };
}

describe('splnkstrm', function() {
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

    it('sdf', function() {
        var s = getSplunkstormMock();

        var Splnkstrm = sandboxed.require('../index', {
            requires: {
                splunkstorm: s
            }
        });

        var a = new Splnkstrm({
            projectId: 'projectId',
            apiKey: 'apiKey'
        });

        expect(s.Log.args).to.deep.equal([['apiKey', 'projectId']]);
    })

});