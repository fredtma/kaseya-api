"use strict";
var appRootPath = require('app-root-path');
require(appRootPath + '/src/common/logger.js');
var config          = require(appRootPath + '/config.json');
var port            = process.env.PORT || config.port;
var express         = require('express');
var morgan          = require('morgan');
var morganOptions   = require(appRootPath + '/src/common/morgan-options.js');
var messages        = require(appRootPath + '/src/common/messages.js');
var soap            = require('soap');

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

// app.use(error.notFoundMiddleware);
// app.use(error.errorHandlerMiddleware);

app.listen(port, function () {
    console.info(messages.app.listening);
});

app.get('/api/v1/soap', function(req, res){
    "use strict";
    let url = "http://support.xpandit.co.za/vsaWS/KaseyaWS.asmx?wsdl";
    let rand= Math.round(Math.random()*100000);
    let ip  = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    ip      = ip.length<6? "196.34.234.245": ip;
    let args= {"UserName":"ftshimanga@xpandit.co.za", "Password":"Twenty16!", "RandomNumber": rand, "BrowserIP":ip, "HasingAlgorithm":"SHA-256"};

    soap.createClient(url, { wsdl_options: { gzip: true } }, function(err, client){
        console.log("RESPONSE",err, client.describe(), client.lastRequest);
        // client.setSecurity(new soap.BasicAuthSecurity('ftshimanga@xpandit.co.za', 'Twenty16!'));
        // client.setSecurity(new soap.WSSecurity('ftshimanga@xpandit.co.za', 'Twenty16!'));
        // console.log("RESPONSE",err, client.describe());

        //res.json(reponse);
        //KaseyaWS.KaseyaWSSoap
        client.Authenticate(args, function(err, result, raw, soapHeader){
            console.log(result, "PASSED");
            console.log(err, result, raw, soapHeader);
            res.json(response);
        });
    });
});
