var path = require('path');
var cron = require('node-cron');
var program = require('commander');
var fs = require('fs');
var nconf = require('nconf');
var crypto = require('crypto');

var confPath = "hagonbase_config.json";
var secretProp = "secret";
var keyProp = "key";

function configure () {
    nconf.argv()
        .env()
        .file({ file: confPath });

    program.version("1.0.0")
        //.option('-k, --key <key>', 'Key used to decrypt secret')
        .parse(process.argv);

    /* if (!program.key)
        throw new Error('--key required'); */

    if (!nconf.get(secretProp))
        throw new Error('[secret] property not found');

    if (!nconf.get(keyProp))
        throw new Error('[key] property not found');
}

function decrypt(text, password) {
    var decipher = crypto.createDecipher("aes-256-ctr", password);
    var dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
}

function encrypt(password) {
    var cipher = crypto.createCipher("aes-256-ctr", password);
    var crypted = cipher.update(nconf.get(secretProp),'utf8','hex');
    crypted += cipher.final('hex');

    nconf.set(secretProp, crypted);
    save();
}

function save() {
    nconf.save(function (err) {
        console.log("Config saved !")
        /* fs.readFile(confPath, function (err, data) {
            console.dir(JSON.parse(data.toString()))
        }); */
    });
}

function getSecretKey(password) {
    return decrypt(nconf.get("secret"), password)
}

// configure program
configure();

// export
module.exports = {
    getSecretKey: getSecretKey,
    encrypt: encrypt
};