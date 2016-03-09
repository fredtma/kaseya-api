"use strict";
var soap = require('soap');
module.exports = class API
{

    constructor(url, set)
    {
        this.url        = url;
        this.username   = set.user;
        this.password   = set.pass;
        this.options    = set.options||{};
    }

    cycle(req, res, next)
    {
        console.log('cycle');
        this.req = req;
        this.res = res;
        this.next= next;
    }
    soap(options)
    {
        let url = this.url;
        options = options||this.options;
        return new Promise(function(resolve, reject){
            soap.createClient(url, options, function(err, client) {
                console.log("DESCRIPT", client.describe());
                if(err) reject(err, client);
                resolve(client);
            });
        });
    }

};
