'use strict';
var morgan = require('morgan');

function winstonStream() {
    return {
        write: function (message) {
            console.log('trace', message);
        }
    };
}

module.exports = {
    morganOptions: {
        skip: function (req) {
            if (req.headers['user-agent'] === 'AlwaysOn') {
                return true;
            }
            var ignoredUrls = ['/public/', '/favicon.ico'];
            var ignore = false;
            ignoredUrls.forEach(function (ignoredUrl) {
                if (req.originalUrl.toLowerCase().indexOf(ignoredUrl.toLowerCase()) >= 0) {
                    ignore = true;
                }
            });
            return ignore;
        },
        stream: winstonStream()
    },
    initialise: function () {
        morgan.token('body', function (req) {
            if (req.method === 'POST' || req.method === 'PUT') {
                if (req.body.password || req.body.client_secret) {
                    var bodyClone = JSON.parse(JSON.stringify(req.body));
                    if (bodyClone.password) {
                        bodyClone.password = '****';
                    }
                    return JSON.stringify(bodyClone);
                }
                return JSON.stringify(req.body);
            }
            return '';
        });
    },
    format: '[:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :body'
};
