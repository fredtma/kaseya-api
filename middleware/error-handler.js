//var config = require('../service/config');
var strformat   = require('strformat');
var uuid        = require('node-uuid');
var _           = require('lodash');

var userErrorTemplate   = 'User error: {message}. Reference: {reference}, url: {url}, method: {method}, status: {status}';
var serverErrorTemplate = 'Server error: {message}, {devMessage}. Reference: {reference}, url: {url}, method: {method}, status: {status}, stack: {stack}.';

var devFields   = ['message', 'devMessage', 'error', 'stack', 'url', 'reference'];
var prodFields  = ['message', 'reference', 'error'];

var fieldFilter = true ? devFields : prodFields;

function errorHandler(err, req, res, next)
{
    var status      = err.status || 500;
    var error       = err.status < 500 ? err : {message: 'Error while processing request'};
    var userMessage = status < 500 ? "Error while processing request" : error.message;
    var reference   = uuid.v4();
    var stack       = err.stack;

    var errObj = {
        message: userMessage,
        devMessage: err.message || err,
        reference: reference,
        stack: stack || 'no stack trace',
        method: req.method,
        url: req.url,
        status: status,
        error: error
    };
    if(err.status && err.status < 500)
    {
        var logMessage = strformat(userErrorTemplate, errObj);
        console.warn(logMessage, err);
    }
    else
    {
        var logMessage = strformat(serverErrorTemplate, errObj);
        console.error(logMessage, err);
    }

    res.status(status);
    res.json(_.pick(errObj, fieldFilter));
}

module.exports = errorHandler;
