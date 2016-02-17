'use strict';

// dependencies
var debug = require('debug')('broadsign')
  , iconv = require('iconv-lite')
  , command = require('minimist')
  , request = require('request')
  , xml = require('xml2json')
  , path = require('path')
  , fs = require('fs')
  , _ = require('lodash');

// components
var Util = require('./util');

// parse argv
var argv = command(process.argv.slice(2));
if(!_.has(argv, 'domainid') || !_.isFinite(argv.domainid)) {
    console.log('please provide numeric `domainid` argument');
    return;
}

// request template
var template = _.template(fs.readFileSync(path.join(__dirname, 'requestbody.xml')));
var prepareBody = function (action, body) {
    return iconv.encode(template({
        action: action,
        body: _.chain(body)
            .keys()
            .map(function (k) {
                return k+'="'+body[k]+'"';
            })
            .value().join(' ')
    }), 'utf-16');
};

// payload
var payload = {
    method: 'content_mgr_import_from_url',
    body: {
        url: 'http://creatormedia.broadsign.com/images/logo.png',
        name: 'API TEST IMPORT',
        domain_id: argv.domainid
    }
};

// request authorization
var certificates = {
    agentOptions: {
        rejectUnauthorized: false,
        ca: fs.readFileSync(path.join(__dirname, 'private', 'ca_cert.pem')),
        key: fs.readFileSync(path.join(__dirname, 'private', 'sdk_key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'private', 'sdk_cert.pem'))
    }
};

// prepare request
var options = _.merge({
    url: 'https://bssopen.broadsign.com:10803',
    headers: {
        'User-Agent': 'devcollectief/broadsign',
        'Content-type': 'text/xml;charset=utf-16',
        'Connection': 'keep-alive',
        'SOAPAction': 'http://www.broadsign.com/{method}'.replace('{method}', payload.method),
        'Content-length': prepareBody(payload.method, payload.body).length
    },
    body: prepareBody(payload.method, payload.body)
}, certificates);


// perform request
request.post(options, function (err, response, body) {
    if(!err && response.statusCode === 200) {

        // parse response xml
        var data = JSON.parse(xml.toJson(body.substring(2)));
        Util.inspect(data);

        // get content
        data = data['soap:Envelope']['soap:Body'].response.content;

        // display content
        console.log('content', data);

    } else {
        debug('request error', err);
    }
});