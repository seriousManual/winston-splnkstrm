var os = require("os");
var util = require("util");
var winston = require("winston");
var splunkstorm = require("splunkstorm");

var PATTERN_WHITESPACE_REPLACE = /[\r\n]/g;
var PATTERN_WHITESPACE_DETECT = /\s/;
var PATTERN_QUOTE = /"/g;

var STD_LEVEL = 'info';
var LEVEL_KEY = 'lvl';
var MESSAGE_KEY = 'mssg';
var HOST_KEY = 'hst';

var Splnkstrm = winston.transports.SplunkStorm = function (options) {
    options = options || {};

    var apiKey = options.apiKey;
    var projectId = options.projectId;

    if(!apiKey || !projectId) {
        throw new Error('apiKey and/or projectId not set');
    }

    this._storm = new splunkstorm.Log(apiKey, projectId);
    this._sourceType = options.sourceType || 'syslog';
    this._source = options.source || '';
    this._host = options.host || os.hostname();

    this._options = options;
};

util.inherits(Splnkstrm, winston.Transport);

Splnkstrm.prototype.log = function (level, message, pairs, callback) {
    var result = this._buildKeyValuePairs(level, message, pairs);

    this._storm.send(result, this._sourceType, this._host, this._source, function(error, response, body) {
        console.log( body );
    });
};

Splnkstrm.prototype.logException = function (msg, meta, callback) {
//    this.storm.send("Exception " + msg, this.options.sourcetype, this.options.host, this.options.source, function (err) {
//        callback(err, !err)
//    });
};

Splnkstrm.prototype._buildKeyValuePairs = function(level, message, pairs) {
    var parameters = pairs || {};

    if(message) {
        parameters[MESSAGE_KEY] = message;
    }

    parameters[LEVEL_KEY] = level;
    parameters[HOST_KEY] = this._options.host || os.hostname();

    return Object.keys(parameters)
        .map(function(key) {
            var value = (parameters[key] + '')
                .replace(PATTERN_WHITESPACE_REPLACE, '')
                .replace(PATTERN_QUOTE, '\'')
                .trim();

            if(value.match(PATTERN_WHITESPACE_DETECT)) {
                value = util.format('"%s"', value);
            }

            if(!value) {
                value = '""';
            }

            return util.format('%s=%s', key, value);
        })
        .join(', ');
};

module.exports = Splnkstrm;