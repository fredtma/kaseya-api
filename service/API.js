"use strict";
var soap = require('soap');

module.exports = class API{
    const HASH = "SHA-1";

    constructor(url, set)
    {
        this.url        = url;
        this.username   = set.user;
        this.password   = set.pass;
        this.options    = set.options||{};
    }

    soap(options)
    {
        return new Promise(function(resolve, reject){
            soap.createClient(this.url, options, function(err, client) {
                if(err) reject(err, client);
                resolve(client);
            });
        });
    }

    arg()
    {
        let args= {req:{}};
        arg.reg = {user, pass}
    }
};
