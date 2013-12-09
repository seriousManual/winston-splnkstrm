# winston-splnkstrm

[![Build Status](https://travis-ci.org/zaphod1984/winston-splnkstrm.png)](https://travis-ci.org/zaphod1984/winston-splnkstrm)

[![NPM](https://nodei.co/npm/winston-splnkstrm.png)](https://nodei.co/npm/winston-splnkstrm/)

[![NPM](https://nodei.co/npm-dl/winston-splnkstrm.png?months=3)](https://nodei.co/npm/winston-splnkstrm/)

In their [Logging Best Practises](http://dev.splunk.com/view/logging-best-practices/SP-CAAADP6) Splunk  strongly encourages the usage of key-value pairs in logs.
This winston plugin takes messages and meta data hashes and creates a key-value structured string out of it.

## Installation

````
npm install winston-splnkstrm
````

## Example Usage

````javascript
var winston = require('winston');
var Splnkstrm = require('winston-splnkstrm');

winston.add(Splnkstrm, {
    apiKey: 'api-key',
    projectId: 'projectId'
});

winston.info({a: 'b'});

//output: 2013-12-09T07:10:49.522Z a=b, lvl=info, hst=fooHost
````

### Parameters for the SplnkStrm constructor:

* `apiKey` your apiKey at splunkstorm.com (mandatory)
* `projectId` your projectId at splunkstorm.com (mandatory)
* `sourceType` an arbitrary sourceType, defaults to 'syslog'
* `source` your source, defaults to ''
* `host` a host that should be used. defaults to `os.hostname()`

