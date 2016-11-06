'use strict'

var Utils = require('../utils/utils');

var Message = (function(){

	var _translate = function(lang, message) {
		var file = (lang === false)? './I18N_EN.json' : './I18N_' + lang + '.json',
			json = require(file),
			msg = Utils.keyInObject(message, json) || Utils.keyInObject('COMMON.TECHNICAL_ERROR', json);
		return msg;
	};

	return{
		translate: _translate
	};

}());

module.exports = Message;