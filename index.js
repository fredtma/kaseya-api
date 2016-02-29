"use strict";

var appRootPath     = require('app-root-path');
require(appRootPath + '/src/common/logger.js');
var config          = require(appRootPath + '/config.json');
var cors            = require('cors');
var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var messages        = require(appRootPath + '/src/common/messages.js');
var morgan          = require('morgan');
var morganOptions   = require(appRootPath + '/src/common/morgan-options.js');
var port            = process.env.PORT || config.port;
//Custom
var api                 = require('./routes/api');
var mwError             = require('./middleware/error-handler');
var mwNotFoundHandler   = require('./middleware/not-found-handler');
var session             = require('express-session');

app.use(cors());
app.use(session({
    genid: function(req) {
        return require('crypto').randomBytes(48).toString('hex');
    },
    resave: true,
    secret: '3ccl3s!aDEI',
    saveUninitialized: false,
    cookie: {
        httpOnly: false,
        maxAge: 2*60*60*1000,
        path: '/'
    }
}));

app.use(function(req, res, next) {
  req.headers['content-type'] = 'application/json;charset=UTF-8';
  return next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

morganOptions.initialise();
app.use(morgan(morganOptions.format, morganOptions.morganOptions));

app.use('/testerror', function(req, res, next) {
  return next(new Error("Test error"));
});

app.use('/api/v1', api);
app.use(mwNotFoundHandler);
app.use(mwError);

app.listen(port, function() {
  console.info(messages.app.listening);
});


