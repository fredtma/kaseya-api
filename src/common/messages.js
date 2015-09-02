'use strict';
var appRootPath = require('app-root-path');
var config = require(appRootPath + '/config.json');
module.exports = {
    app:{
        exit: config.appName + ' is exiting',
        listening: config.appName + ' is listening on port ' + config.port,
        routeNotFound: function(req){
            return 'Invalid route : ' + req.originalUrl;
        }
    },
    error: {
        middlewareHandled: 'Handled Error passed to middleware',
        middlewareUnhandled: 'Unhandled Error passed to middleware',
        processUnhandled: 'Unhandled Error on process',
        generic: 'Sorry an error has occurred.'
    }
};
