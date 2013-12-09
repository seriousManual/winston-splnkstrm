var expect = require('chai').expect;
var sandboxed = require('sandboxed-module');
var sinon = require('sinon');

var splnkstrm = require('../');

function getSplunkstormMock() {
    var Log = sinon.spy(function(apiKey, projectId) {});

    Log.prototype.send = sinon.spy(function() {});

    return {
        Log: Log
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
            requires: { splunkstorm: s }
        });

        var a = new Splnkstrm({
            projectId: 'projectId',
            apiKey: 'apiKey'
        });

        expect(s.Log.args).to.deep.equal([['apiKey', 'projectId']]);
    });

    describe('key value paris', function() {
        it('should incorporate level and message into kvstring', function() {
            var s = new splnkstrm({apiKey: 'foo', projectId: 'foo1'});

            var pairString = s._buildKeyValuePairs('info', 'foo');

            expect(pairString).to.match(/mssg=foo, lvl=info, hst=.+/);
        });

        it('should incorporate level and message into kvstring', function() {
            var s = new splnkstrm({apiKey: 'foo', projectId: 'foo1'});

            var pairString = s._buildKeyValuePairs('info', null, {
                a: 'a',
                b: 'b b',
                c: '"a"',
                d: 'd\nd',
                e: ''
            });

            expect(pairString).to.match(/a=a, b="b b", c='a', d=dd, e="", lvl=info, hst=.+/);
        });
    });

});