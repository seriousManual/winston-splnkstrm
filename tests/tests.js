var expect = require('chai').expect;
var sandboxed = require('sandboxed-module');
var sinon = require('sinon');

var Splnkstrm = require('../');

function getSplunkstormMock() {
    return {
        Log: sinon.spy(function(apiKey, projectId) {})
    };
}

describe('Splnkstrm', function() {
    it('should throw if no apiKey is set', function() {
        expect(function() {
            new Splnkstrm({projectId: 'foo'});
        }).to.throw();
    });

    it('should throw if no projectId is set', function() {
        expect(function() {
            new Splnkstrm({apiKey: 'foo'});
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
            var s = new Splnkstrm({apiKey: 'foo', projectId: 'foo1'});

            var pairString = s._buildKeyValuePairs('info', 'foo');

            expect(pairString).to.match(/mssg=foo, lvl=info, hst=.+/);
        });

        it('should incorporate level and message into kvstring', function() {
            var s = new Splnkstrm({apiKey: 'foo', projectId: 'foo1'});

            var pairString = s._buildKeyValuePairs('info', null, {
                a: 'a',
                b: 'b b',
                c: 'c "foo" c',
                d: 'd\nd',
                e: ''
            });

            expect(pairString).to.match(/a=a, b="b b", c="c 'foo' c", d=dd, e="", lvl=info, hst=.+/);
        });
    });

    it('should call log with the correct parameters', function() {
        var Splunkstorm = function() {};
        Splunkstorm.prototype.send = sinon.spy();

        var Splnkstrm = sandboxed.require('../index', {
            requires: {
                splunkstorm: {
                    Log: Splunkstorm
                }
            }
        });

        var a = new Splnkstrm({
            projectId: 'projectId',
            apiKey: 'apiKey',
            source: 'source',
            host: 'host'
        });

        a.log('info', 'foo', {a: 'a'}, 'callback');

        expect(Splunkstorm.prototype.send.args).to.deep.equal([
            ['a=a, mssg=foo, lvl=info, hst=host', 'syslog', 'host', 'source', 'callback']
        ]);
    });

});