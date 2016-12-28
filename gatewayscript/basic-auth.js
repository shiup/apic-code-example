// author : @spoon or @shiup

var apic = require('./apim.custom.js');
apic.output('application/json');

var reqauth = apic.getvariable('request.authorization').split(' ');
var splitval = new Buffer((reqauth[1] || ''), 'base64').toString('utf8').split(':');
var username = splitval[0] || '';
var password = splitval[1] || '';

apic.console.debug('user credential : [' + username + ':' + password + ']');

if (username === apic.getvariable('request.parameters.username') && password === apic.getvariable('request.parameters.password')) {
    session.output.write({"authenticatedUser":username});
    apic.setvariable('message.headers.apic-authenticated-credential', 'cn=' + username + ',email=' + username + '@poon.com,c=us');
    apic.setvariable('message.status.code', 200)
}
else {
    apic.setvariable('message.status.code', 401);
}
