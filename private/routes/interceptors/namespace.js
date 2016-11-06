'use strict'

var Utils = require('../../utils/utils'),
	CONFIG = require('../../config/config');

var Namespace = (function(){

	var _create = function(req, res, next){

		req.CEMS = {
			server: {
				url: Utils.getFullURL(req),
				lang: req.acceptsLanguages(CONFIG.LANG)
			}
		};

		var bearerHeader = req.headers["authorization"];
		if (typeof bearerHeader === 'string') {
			var bearer = bearerHeader.split(" ");
			req.CEMS.server.token = bearer[1];
		}

		next();
	};

	return{
		create: _create
	};

}());

module.exports = Namespace;