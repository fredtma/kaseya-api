"use strick";
var API = require("./API");
module.exports = class KASEYA extends API
{
    //constructor(url, user, pass)
    //{
    //    super(url, user, pass);
    //}

    connect(call, agrs)
    {
        return super.soap(this.options).then(function(client){
            return new Promise(function(resolve, reject){
                let caller;

                switch (call) {
                    case 'group':   caller = client.KaseyaWS.KaseyaWSSoap.GetMachineGroupList; break;
                    case 'agent':   caller = client.KaseyaWS.KaseyaWSSoap.GetPackageURLs; break;
                    case 'agents':  caller = client.KaseyaWS.KaseyaWSSoap.GetMachineUptime; break;
                    default:
                        caller = client.KaseyaWS.KaseyaWSSoap.Authenticate;
                }

                caller(args, function(err, result, raw, soapHeader)
                {
                    if(err) reject(err, result);
                    resolve(result);
                });//caller
            });//promise
        });//super.soap
    }
}
