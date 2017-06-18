var read = require('read');
var cron = require('node-cron');
var nconf = require('nconf');
var Client = require('coinbase').Client;
var base = require('./bin/base');

read({ prompt: 'Password: ', silent: true }, function(er, password) {
    var secret = base.getSecretKey(password);
    var client = new Client({'apiKey': nconf.get("key"), 'apiSecret': secret});

    cron.schedule('* * * * * *', function(){
        client.getBuyPrice({'currencyPair': 'BTC-EUR'}, function(err, obj) {
            console.log('total amount: ' + obj.data.amount);
        });
    });

    console.log('Hagon base running !');
});





