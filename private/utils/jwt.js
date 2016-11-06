'use strict'

var jwt = require('jsonwebtoken'),
	Q = require('q'),
    CONFIG = require('../config/config');

var JWT = (function(){

    var _createJWT = function(payload){
		var token = jwt.sign(payload, CONFIG.TOKEN.SECRET, {expiresIn:CONFIG.TOKEN.EXPIRATION});
		return token;
	};

    var _validateJWT = function(token){
		var deferred = Q.defer();
		jwt.verify(token, CONFIG.TOKEN.SECRET, function(err, decoded) {
			if(err){
				deferred.reject({
					validateToken: '',
					validateDecodedToken: '',
					errorMsg: err.name
				});
			}else{
				deferred.resolve({
					validateToken: token,
					validateDecodedToken: decoded,
					errorMsg: ''
				});
			}
		});
		return deferred.promise;
	};
	
    return{
        createJWT: _createJWT,
        validateJWT: _validateJWT
    };

}());

module.exports = JWT;