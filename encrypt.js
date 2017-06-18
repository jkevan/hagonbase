var read = require('read');
var base = require('./bin/base');

read({ prompt: 'Password: ', silent: true }, function(er, password) {
    base.encrypt(password);
});