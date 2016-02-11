"use strict";
var appRootPath = require('app-root-path');
require(appRootPath + '/src/common/logger.js');
var config = require(appRootPath + '/config.json');
var port = process.env.PORT || config.port;
var express = require('express');
var morgan = require('morgan');
var morganOptions = require(appRootPath + '/src/common/morgan-options.js');
var messages = require(appRootPath + '/src/common/messages.js');
var soap = require('soap');
var crypto = require('crypto');
var sha256 = require('sha256');
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");

var app = express();
app.use(function(req, res, next) {
  req.headers['content-type'] = 'application/json;charset=UTF-8';
  return next();
});

morganOptions.initialise();
app.use(morgan(morganOptions.format, morganOptions.morganOptions));

app.use('/testerror', function(req, res, next) {
  return next(new Error("Test error"));
});

// app.use(error.notFoundMiddleware);
// app.use(error.errorHandlerMiddleware);

app.listen(port, function() {
  console.info(messages.app.listening);
});

app.get('/api/v1/soap', function(req, res) {
  "use strict";
  var url     = "http://support.xpandit.co.za/vsaWS/KaseyaWS.asmx";
  var path    = "assets/KaseyaWS.asmx.xml";
  var pass    = "Twenty16!";
  var username= "ftshimanga@xpandit.co.za";
  var real    = true;
  var rand    = String(Math.random()).substr(2, 16);
  var hash    = (1)? "SHA-256": "SHA-1";
  var ip      = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  var hashAlgorithm = (hash==="SHA-1") ? coverPass : coverPass256;

  // var pass= crypto.createHash('sha256').update("Twenty16!").digest('base64');
  // var pass= sha256.x2('Twenty16!');
  // var pass = SHA256('Twenty16!');
  rand      = (real)? rand: '694892403902486';
  ip        = '169.0.5.2';console.log("zero", pass, username);
  pass      = hashAlgorithm(pass, username);console.log("one", pass, pass.length);
  pass      = (real)? hashAlgorithm(pass, rand): '19fdae62d629e4d5b88aadf7946d2f4138d22c78251c1ece503ffc156a0b2544';
  console.log("LEN", rand, pass.length, '19fdae62d629e4d5b88aadf7946d2f4138d22c78251c1ece503ffc156a0b2544'.length);
  var args = {
    "req": {
      "UserName":         username,
      "CoveredPassword":  pass,
      "RandomNumber":     rand,
      "BrowserIP":        ip,
      "HashingAlgorithm": hash
    }
  };

  soap.createClient(path, {
    "endpoint": url
  }, function(err, client) {
    console.log(args);
    // console.log("RESPONSE",err, client.describe(), client.lastRequest);
    // client.setSecurity(new soap.BasicAuthSecurity('ftshimanga@xpandit.co.za', 'Twenty16!'));
    // client.setSecurity(new soap.WSSecurity('ftshimanga@xpandit.co.za', 'Twenty16!'));
    // console.log("RESPONSE",err, client.describe());

    //res.json(reponse);
    //KaseyaWS.KaseyaWSSoap
    client.KaseyaWS.KaseyaWSSoap.Authenticate(args, function(err, result, raw, soapHeader) {
      console.log(result, "PASSED");
      console.log(err, raw, soapHeader);
      //res.json(response);
    });
  });

  function coverPass256(thePass, theName) {
    // Remove trailing spaces for user name and password
    thePass = thePass.replace(/^\s+/g, '').replace(/\s+$/g, '');
    theName = theName.replace(/^\s+/g, '').replace(/\s+$/g, '');
    console.log("SHA", thePass, theName);
    thePass += theName; // concat the password and name to get more unique
    console.log("SHA", thePass, theName);
    // thePass = hex_sha256(thePass);
    thePass = crypto.createHash('sha256').update(thePass).digest('hex');
    console.log("SHA", thePass, theName);
    return thePass;
  }

  var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode  */
  function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  function S(X, n) {
    return (X >>> n) | (X << (32 - n));
  }

  function R(X, n) {
    return (X >>> n);
  }

  function Ch(x, y, z) {
    return ((x & y) ^ ((~x) & z));
  }

  function Maj(x, y, z) {
    return ((x & y) ^ (x & z) ^ (y & z));
  }

  function Sigma0256(x) {
    return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
  }

  function Sigma1256(x) {
    return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
  }

  function Gamma0256(x) {
    return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
  }

  function Gamma1256(x) {
    return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
  }

  function core_sha256(m, l) {
    var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
    var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;
    /* append padding */
    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >> 9) << 4) + 15] = l;
    for (var i = 0; i < m.length; i += 16) {
      a = HASH[0];
      b = HASH[1];
      c = HASH[2];
      d = HASH[3];
      e = HASH[4];
      f = HASH[5];
      g = HASH[6];
      h = HASH[7];
      for (var j = 0; j < 64; j++) {
        if (j < 16) W[j] = m[j + i];
        else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
        T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
        T2 = safe_add(Sigma0256(a), Maj(a, b, c));
        h = g;
        g = f;
        f = e;
        e = safe_add(d, T1);
        d = c;
        c = b;
        b = a;
        a = safe_add(T1, T2);
      }
      HASH[0] = safe_add(a, HASH[0]);
      HASH[1] = safe_add(b, HASH[1]);
      HASH[2] = safe_add(c, HASH[2]);
      HASH[3] = safe_add(d, HASH[3]);
      HASH[4] = safe_add(e, HASH[4]);
      HASH[5] = safe_add(f, HASH[5]);
      HASH[6] = safe_add(g, HASH[6]);
      HASH[7] = safe_add(h, HASH[7]);
    }
    return HASH;
  }

  function str2binb(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz)
      bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
    return bin;
  }

  function binb2hex(binarray) {
    var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase */
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
      str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
    }
    return str;
  }

  function hex_sha256(s) {
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
  }


  function coverPass(thePass, theName) {
    thePass += theName; // concat the password and name to get more unique

    var a = 0x67452301;
    var b = 0xEFCDAB89;
    var c = 0x98BADCFE;
    var d = 0x10325476;
    var e = 0xC3D2E1F0;
    var w = new Array(80);
    var nblk = ((thePass.length + 8) >> 6) + 1;
    var x = new Array(nblk * 16);
    var i = 0;
    var j = 0;

    for (i = 0; i < (nblk * 16); i++) {
      x[i] = 0;
    }
    for (i = 0; i < thePass.length; i++) {
      x[i >> 2] |= thePass.charCodeAt(i) << (24 - (i % 4) * 8);
    }
    x[i >> 2] |= 0x80 << (24 - (i % 4) * 8);
    x[nblk * 16 - 1] = thePass.length * 8;

    for (i = 0; i < x.length; i += 16) {
      var oldA = a;
      var oldB = b;
      var oldC = c;
      var oldD = d;
      var oldE = e;

      for (j = 0; j < 80; j++) {
        if (j < 16) w[j] = x[i + j];
        else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
        var t = sum32(sum32(rol(a, 5), ft(j, b, c, d)), sum32(sum32(e, w[j]), kt(j)));
        e = d;
        d = c;
        c = rol(b, 30);
        b = a;
        a = t;
      }

      a = sum32(a, oldA);
      b = sum32(b, oldB);
      c = sum32(c, oldC);
      d = sum32(d, oldD);
      e = sum32(e, oldE);
    }
    return numToHex(a) + numToHex(b) + numToHex(c) + numToHex(d) + numToHex(e);
  }

  function numToHex(num) { // convert to a hex string
    var hexStr = "";
    for (var i = 7; i >= 0; i--) {
      hexStr += "0123456789abcdef".charAt((num >> (i * 4)) & 0x0F);
    }
    return hexStr;
  }

  function ft(t, b, c, d) {
    if (t < 20) return (b & c) | ((~b) & d);
    if (t < 40) return b ^ c ^ d;
    if (t < 60) return (b & c) | (b & d) | (c & d);
    return (b ^ c ^ d);
  }

  function kt(t) {
    if (t < 20) {
      return (0x5A827999);
    }
    if (t < 40) {
      return (0x6ED9EBA1);
    }
    if (t < 60) {
      return (0x8F1BBCDC);
    }
    return (0xCA62C1D6);
  }

  function sum32(x, y) {
    return ((x & 0x7FFFFFFF) + (y & 0x7FFFFFFF)) ^ (x & 0x80000000) ^ (y & 0x80000000);
  }

  function rol(theNum, cnt) {
    return (theNum << cnt) | (theNum >>> (32 - cnt));
  }

  function toggleChecked() {
    alert('asdf');
  }


});
