var winston = require('winston');
var SplunkStorm = require('../');

winston.add(SplunkStorm, {
    apiKey: 'api-key',
    projectId: 'projectId'
});

winston.info({a: 'b'});