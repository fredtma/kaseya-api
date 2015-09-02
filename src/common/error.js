'use strict';
var appRootPath = require('app-root-path');
var messages = require(appRootPath + '/src/common/messages.js');

function StatusError(statusCode, errorMessage) {
    var error = new Error(errorMessage);
    error.status = statusCode;
    return error;
}

//noinspection JSUnusedLocalSymbols
module.exports = {
    badRequest: function (errorMessage) {
        return StatusError(400, errorMessage);
    },
    unauthorised: function (errorMessage) {
        return StatusError(401, errorMessage);
    },
    forbidden: function (errorMessage) {
        return StatusError(403, errorMessage);
    },
    notFound: function (errorMessage) {
        return StatusError(404, errorMessage);
    },
    conflict: function (errorMessage) {
        return StatusError(409, errorMessage);
    },
    server: function(errorMessage){
        return StatusError(500, errorMessage);
    },
    unavailable: function (errorMessage) {
        return StatusError(503, errorMessage);
    },
    StatusError: StatusError,
    errorHandlerMiddleware: function (err, req, res, next) {
        /*jshint unused: vars*/
        if (!err.status) {
            console.error(messages.error.middlewareUnhandled, err);
            return res.status(500).send(messages.error.generic);
        }
        console.error(messages.error.middlewareHandled, err);
        if (err.status < 500) {
            return res.status(err.status).send(err.message);
        }
        return res.status(500).send(messages.error.generic);
    },
    notFoundMiddleware:function(req,res,next){
        return next(module.exports.notFound(messages.app.routeNotFound(req)));
    }
};

process.on('uncaughtException', function (err) {
    console.error(messages.error.processUnhandled, err);
    process.exit(1);
});

process.on('exit', function () {
    console.log(messages.app.exit);
});