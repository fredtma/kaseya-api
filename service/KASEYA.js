"use strict";
var API = require("./API");

module.exports = class KASEYA extends API
{
    //constructor(url, user, pass)
    //{
    //    super(url, user, pass);
    //}

    connect(call, args)
    {
        var self = this;
        return super.soap(this.options).then(success).catch(failed);//super.soap

        function success(client)
        {
            return new Promise(function(resolve, reject){
                let caller;

                switch (call) {
                    case 'agent':   caller = client.KaseyaWS.KaseyaWSSoap.GetPackageURLs; break;
                    case 'agents':  caller = client.KaseyaWS.KaseyaWSSoap.GetMachineUptime; break;
                    case 'agentNew':caller = client.KaseyaWS.KaseyaWSSoap.CreateAgentInstallPackage; break;
                    case 'group':   caller = client.KaseyaWS.KaseyaWSSoap.GetMachineGroupList; break;
                    case 'orgs':    caller = client.KaseyaWS.KaseyaWSSoap.GetOrgs; break;
                    case 'orgNew':  caller = client.KaseyaWS.KaseyaWSSoap.AddOrg ; break;
                    case 'orgType': caller = client.KaseyaWS.KaseyaWSSoap.GetOrgTypes; break;
                    case 'role':    caller = client.KaseyaWS.KaseyaWSSoap.GetRoles ; break;
                    case 'scope':   caller = client.KaseyaWS.KaseyaWSSoap.GetScopes ; break;
                    default:
                        caller = client.KaseyaWS.KaseyaWSSoap.Authenticate;
                }

                caller(args, function(err, result, raw, soapHeader)
                {
                    let key;
                    let status;
                    for (key in result) break;

                    if(err)  {
                        status          = 410;
                        let error       = new Error(err);
                        error.status    = status;
                        error.message   = err;

                        self.next(error);
                        return reject(error, result);
                    }
                    if(result && result[key] && result[key].ErrorMessage)  {
                        status          = result[key].ErrorMessage.indexOf('Session')!==-1? 401: 410;
                        let error       = new Error(err);
                        error.status    = status;
                        error.message   = result[key].ErrorMessage;

                        self.next(error);
                        return reject(error, result);
                    }
                    //console.log("RAW",raw);
                    //console.log("soapHeader",soapHeader, err);
                    resolve(result);
                });//caller
            });//promise
        }

        function failed(err, kaseya)
        {
            console.log(err);
            console.log(kaseya.describe());
            console.log(kaseya);
        }
    }
};

