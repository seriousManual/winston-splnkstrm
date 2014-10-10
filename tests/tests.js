var expect = require('chai').use(require('sinon-chai')).expect;
var sandboxed = require('sandboxed-module');
var sinon = require('sinon');

var Splnkstrm = require('../');

function getSplunkstormMock() {
    function SplunkStorm(options) {
        this._options = options;
    }

    SplunkStorm.prototype.send = sinon.spy(function(logMessage, sourceType, host, source, callback) {
        callback(null);
    });

    return SplunkStorm;
}

describe('Splnkstrm', function() {
    it('should throw if no apiKey is set', function() {
        expect(function() {
            new Splnkstrm({projectId: 'foo', apiHostName: 'fooApiHost'});
        }).to.throw();
    });

    it('should throw if no projectId is set', function() {
        expect(function() {
            new Splnkstrm({apiKey: 'foo', apiHostName: 'fooApiHostName'});
        }).to.throw();
    });

    it('should throw if no apiHostName is set', function() {
        expect(function() {
            new Splnkstrm({apiKey: 'foo', projectId: 'fooProjectId'});
        }).to.throw();
    });

    it('should throw if parameters are missing', function() {
        expect(function() {
            new Splnkstrm({});
        }).to.throw();
    });

    it('should create instance', function() {
        var s = getSplunkstormMock();

        sandboxed.require('../index', {
            requires: { splunkstorm: s }
        });

        var a = new Splnkstrm({
            projectId: 'projectId',
            apiKey: 'apiKey',
            apiHostName: 'hostName'
        });

        expect(a._options).to.deep.equal({
            projectId: 'projectId',
            apiKey: 'apiKey',
            apiHostName: 'hostName'
        });
    });

    describe('key value paris', function() {
        it('should incorporate level and message into kvstring', function() {
            var s = new Splnkstrm({apiKey: 'foo', projectId: 'foo1', apiHostName: 'foo2'});

            var pairString = s._buildKeyValuePairs('info', 'foo');

            expect(pairString).to.match(/mssg=foo, lvl=info, hst=.+/);
        });

        it('should incorporate level and message into kvstring', function() {
            var s = new Splnkstrm({apiKey: 'foo', projectId: 'foo1', apiHostName: 'foo2'});

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
        var clock = sinon.useFakeTimers();

        var Splunkstorm = function() {};
        Splunkstorm.prototype.send = sinon.spy();

        var loggerInstance = new Splnkstrm({
            projectId: 'projectId',
            apiKey: 'apiKey',
            apiHostName: 'apiHostName'
        });

        loggerInstance._storm = {
            send: sinon.spy()
        };

        loggerInstance.log('info', 'foo', {a: 'a'}, 'callback');
        expect(loggerInstance._storm.send).to.be.calledWith('1970-01-01T00:00:00.000Z a=a, mssg=foo, lvl=info, hst=Bert', 'syslog', 'Bert', '', 'callback');

        clock.restore();
    });

});