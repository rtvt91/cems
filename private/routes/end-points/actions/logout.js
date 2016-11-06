'use strict'

var CONST = require('../../../config/constant'),
    Message = require('../../../message/message');

module.exports = function(req, res){
    res.json({
        msgType:'logout',
        msg: Message.translate(req.CEMS.server.lang, CONST.USER.SUCCESS.DISCONNECTION)
    });
};