"use strict";

var appRootPath     = require('app-root-path');
require(appRootPath + '/src/common/logger.js');
var config          = require(appRootPath + '/config.json');
var port            = process.env.PORT || config.port;
var express         = require('express');
var morgan          = require('morgan');
var morganOptions   = require(appRootPath + '/src/common/morgan-options.js');
var messages        = require(appRootPath + '/src/common/messages.js');
var soap            = require('soap');
var app             = express();
var session         = require('express-session');
var hash256         = require('./service/hash256').coverPass256;
//var API             = require('./service/KASEYA.js');
//var KASEYA          = new API("assets/KaseyaWS.asmx.xml", {"options":{"endpoint":"http://support.xpandit.co.za/vsaWS/KaseyaWS.asmx"}});

console.log('one');
app.use(session({
  genid: function(req) {
    return require('crypto').randomBytes(48).toString('hex');
  },
  secret: '3ccl3s!aDEI',
  resave: true,
  saveUninitialized: false
}));
console.log('two');
app.use(function(req, res, next) {
  req.headers['content-type'] = 'application/json;charset=UTF-8';
  return next();
});
console.log('three');
morganOptions.initialise();
app.use(morgan(morganOptions.format, morganOptions.morganOptions));

app.use('/testerror', function(req, res, next) {
  return next(new Error("Test error"));
});
console.log('four');
// app.use(error.notFoundMiddleware);
// app.use(error.errorHandlerMiddleware);

app.listen(port, function() {
  console.info(messages.app.listening);
});

app.get('/api/v1/soap', function(req, res) {

    var pass          = "Twenty16!";
    var username      = "ftshimanga@xpandit.co.za";
    var rand          = String(Math.random()).substr(2, 16);
    var hash          = (1)? "SHA-256": "SHA-1";
    var ip            = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var hashAlgorithm = hash256;
    pass        = hashAlgorithm(pass, username);
    pass        = hashAlgorithm(pass, rand);

    var args = {
      "req": {
        "UserName":         username,
        "CoveredPassword":  pass,
        "RandomNumber":     rand,
        "BrowserIP":        ip,
        "HashingAlgorithm": hash
      }
    };
    //KASEYA.connect(args);
    client.KaseyaWS.KaseyaWSSoap.Authenticate(args, function(err, result, raw, soapHeader) {
      console.log(args, result, "PASSED");//AuthenticateResult.SessionID
      console.log(err, raw, soapHeader);
      req.session.kaseyaKey = result.AuthenticateResult.SessionID;
      res.json(result);
    });

});
console.log('fice');
app.get('/api/v1/soap/group', function(req, res)
{

  soapCall(function(client){
      //req.session.kaseyaKey = '99344256054293301604191319';
      var ip  = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
      var args= {"req": {"BrowserIP":  ip, "SessionID":  req.session.kaseyaKey}};
      console.log("Group", args);
      client.KaseyaWS.KaseyaWSSoap.GetMachineGroupList(args, function(err, result, raw, soapHeader){
        console.log("Result::", result);
        res.json(result);
      });
  });
});
console.log('six');
app.get('/api/v1/soap/agents', function(req, res)
{
  res.json({"session":req.session.kaseyaKey});
  var ip      = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  var args = {
    "req": {
      "AgentGuid":        AgentGuid,
      "rptDate":          rptDate,
      "MachineGroup":     MachineGroup,
      "ReturnAllRecords": ReturnAllRecords,
      "BrowserIP":        ip,
      "SessionID":        SessionID
    }
  };
  soapCall(function(client){
    client.KaseyaWS.KaseyaWSSoap.GetMachineUptime(args, function(err, result, raw, soapHeader){

    });
  });
});
console.log('seven');
app.get('/api/v1/soap/agent', function(req, res)
{
  res.json({"session":req.session.kaseyaKey});
  var ip        = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  var GroupName = "servers.xit";
  var args = {
    "req": {
      "GroupName":  GroupName,
      "BrowserIP":  ip,
      "SessionID":  req.session.kaseyaKey||'68001645206478818033497805'
    }
  };
  console.log("req", req.session, args);
  soapCall(function(client){
    client.KaseyaWS.KaseyaWSSoap.GetPackageURLs(args, function(err, result, raw, soapHeader){
      if(err) res.json({"success":false, "message":"there was an error processing the request", "result": result});
      console.log(result.GetPackageURLsResult.Packages.Package, err, soapHeader);
      res.json(result.GetPackageURLsResult.Packages.Package);
    });
  });
});
console.log('eight');
function soapCall(callback){

    var url     = "http://support.xpandit.co.za/vsaWS/KaseyaWS.asmx";
    var path    = "assets/KaseyaWS.asmx.xml";
    var real    = true;

    soap.createClient(path, {"endpoint": url}, function(err, client) {
      callback(client);
    });
}
