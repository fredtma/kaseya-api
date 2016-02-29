"user strick";
var express = require('express');
var router  = express.Router();
var _       = require('lodash');
//Custom

var API     = require('../service/KASEYA.js')
var hash256 = require('../service/hash256').coverPass256;
var KASEYA  = new API("assets/KaseyaWS.asmx.xml", {"options":{"endpoint":"http://support.xpandit.co.za/vsaWS/KaseyaWS.asmx"}});

router.use('/soap', mwPrepare);
router.post('/soap', auth);
router.get('/soap/agent/:group', agent);
router.post('/soap/agent/:group', agentNew);
router.get('/soap/agents/:group', agents);
router.get('/soap/group', group);
router.get('/soap/organisation', orgs);
router.post('/soap/organisation', orgNew);
router.get('/soap/users', users);

function auth(req, res)
{

    var pass    = req.body.CoveredPassword||"Twenty16!";
    var username= req.body.UserName||"ftshimanga@xpandit.co.za";
    var rand    = String(Math.random()).substr(2, 16);
    var hash    = (1)? "SHA-256": "SHA-1";
    var ip      = req.body.BroswerIP||req.v1.ip;
    pass        = hash256(pass, username);
    pass        = hash256(pass, rand);

    var args = {
        "req": {
            "UserName":         username,
            "CoveredPassword":  pass,
            "RandomNumber":     rand,
            "BrowserIP":        ip,
            "HashingAlgorithm": hash
        }
    };
    KASEYA.connect(null, args).then(callback);

    function callback(result) {
        req.session.kaseyaSess = result.AuthenticateResult.SessionID;
        return res.json(result);
    }
}

function agent(req, res)
{
    var args = {
        "req": {
            "GroupName":  req.params.group||"servers.xit",
            "BrowserIP":  req.v1.ip,
            "SessionID":  req.v1.kaseyaSess
        }
    };

    KASEYA.connect('agent', args).then(callback);
    function callback(result){
        return res.json(result);
    };
}

function agentNew(req, res)
{
    var args= {req:req.body};
    args.req.GroupName  = req.params.group||"servers.xit";
    args.req.BrowserIP  = req.v1.ip;
    args.req.SessionID  = req.v1.kaseyaSess;

    KASEYA.connect('agentNew', args).then(callback);
    function callback(result){
        return res.json(result);
    };
}

function agents(req, res)
{
    var ip  = req.v1.ip;
    var args= {
        "req": {
            "AgentGuid":        AgentGuid,
            "rptDate":          rptDate,
            "MachineGroup":     MachineGroup,
            "ReturnAllRecords": ReturnAllRecords,
            "BrowserIP":        ip,
            "SessionID":        req.v1.kaseyaSess
        }
    };
    KASEYA.connect('agents', args).then(callback);
    function callback(result){
        res.json(result);
    }
}

function group(req, res)
{
    var ip  = req.v1.ip;
    var args= {"req": {"BrowserIP":  ip, "SessionID":  req.v1.kaseyaSess}};
    KASEYA.connect('group', args).then(callback);
    function callback(result){
        result.GetMachineGroupListResult.MachineGroups.groupName.sort();
        res.json(result);
    }
}

function orgs(req, res, next)
{
    var args= {"req": {"SessionID":  req.v1.kaseyaSess}};
    KASEYA.connect('orgs', args).then(callback);
    function callback(result){
        res.json(result);
    }
}

function orgNew(req, res)
{
    var args= {req:req.body};
    args.req.BrowserIP  = req.v1.ip;
    args.req.SessionID  = req.v1.kaseyaSess;

    KASEYA.connect('orgNew', args).then(callback);
    function callback(result){
        res.json(result);
    }
}

function users(req, res, next)
{
    var args= {"req": {"SessionID":  req.v1.kaseyaSess}};
    KASEYA.connect('users', args).then(callback);
    function callback(result){
        res.json(result);
    }
}

function mwPrepare(req, res, next)
{
    console.log("Result", req.headers['kaseya-ip'], req.session.kaseyaSess, req.headers['kaseya-sess']);
    req.v1              = {};
    req.v1.ip           = req.headers['kaseya-ip']||req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    req.v1.kaseyaSess   = req.session.kaseyaSess||req.headers['kaseya-sess']||'91422713194722770576449885';
    KASEYA.cycle(req, res, next);
    next();
}

module.exports = router;