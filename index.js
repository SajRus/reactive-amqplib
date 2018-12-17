'use strict';

var RxAmqpLib = require('./build/main/RxAmqpLib');
var RxConnection = require('./build/main/RxConnection');
var RxChannel = require('./build/main/RxChannel');
var RxMessage = require('./build/main/RxMessage');

module.exports.newConnection = RxAmqpLib.default.newConnection;
module.exports.RxConnection = RxConnection.default;
module.exports.RxChannel = RxChannel.default;
module.exports.RxMessage = RxMessage.default;
