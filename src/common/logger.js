'use strict';
var util = require('util');
var winston = require('winston');
var appRootPath = require('app-root-path');
var settings = require(appRootPath + '/config.json');
require('winston-loggly');
var logger = new winston.Logger();

switch ((process.env.NODE_ENV || '').toLowerCase()) {
    case 'production':
    case 'qa':
        addFileLogging('info');
        addConsoleLogging('info');
        addLogglyLogging('warn');
        break;
    case 'test':
        return;
    default:
        addFileLogging('silly');
        addConsoleLogging('silly');
        break;
}

function addConsoleLogging(level) {
    logger.add(winston.transports.Console, {
        colorize: true,
        timestamp: true,
        level: level
    });
}

function addFileLogging(level) {
    var fileLogPath = appRootPath.resolve('./logs/');
    console.log('fileLogPath : ' + fileLogPath);
    logger.add(winston.transports.DailyRotateFile, {
        name: 'file',
        datePattern: '.yyyy-MM-ddTHH',
        filename: fileLogPath + 'log_file.log',
        level: level,
        'colorize': true,
        handleExceptions: true,
        exitOnError: false
    });
}

function addLogglyLogging(level) {
    logger.add(winston.transports.Loggly, {
        level: level,
        json: true,
        inputToken: settings.loggly.token,
        subdomain: settings.loggly.subdomain,
        "auth": {
            "username": settings.loggly.username,
            "password": settings.loggly.password
        },
        tags: [settings.appName]
    });
}

function formatArgs(args) {
    var argumentArray = Array.prototype.slice.call(args);
    var argumentsToPrint = argumentArray.map(function (arg) {
        if (arg instanceof Error) {
            return {
                message: arg.message,
                stack: arg.stack
            };
        }
        return arg;
    });
    return [util.format.apply(util.format, argumentsToPrint)];
}

console.log = function () {
    logger.info.apply(logger, formatArgs(arguments));
};
console.info = function () {
    logger.info.apply(logger, formatArgs(arguments));
};
console.warn = function () {
    logger.warn.apply(logger, formatArgs(arguments));
};
console.error = function () {
    logger.error.apply(logger, formatArgs(arguments));
};
console.debug = function () {
    logger.debug.apply(logger, formatArgs(arguments));
};
