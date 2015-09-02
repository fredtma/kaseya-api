var appRootPath = require('app-root-path');
require(appRootPath + '/src/common/logger.js');
var config = require(appRootPath + '/config.json');
var port = process.env.PORT || config.port;
var express = require('express');
var morgan = require('morgan');
var morganOptions = require(appRootPath + '/src/common/morgan-options.js');
var messages = require(appRootPath + '/src/common/messages.js');


var app = express();
app.use(function(req, res, next){
    req.headers['content-type'] = 'application/json;charset=UTF-8';
    return next();
});

morganOptions.initialise();
app.use(morgan(morganOptions.format, morganOptions.morganOptions));

app.use('/testerror', function (req, res, next) {
    return next(new Error("Test error"));
});

app.use(error.notFoundMiddleware);
app.use(error.errorHandlerMiddleware);

app.listen(port, function () {
    console.info(messages.app.listening);
});