'use strict'

var Q = require('q'),
	Category = require('../../../mongo-models/category'),
    CONST = require('../../../config/constant'),
	Utils = require('../../../utils/utils'),
	Message = require('../../../message/message');

module.exports = function(){

	var myReq, myRes;
	var internal = {
		__error: function(param){
			if(param){
				myRes.json(param);
			}else{
				myRes.status(401).end();
			}
		},
		__success: function(param){
			myRes.json(param);
		},
		__updateCategory: function(category_id){
			var deferred = Q.defer();
			Category.update(category_id, myReq.CEMS.categoryInput)
					.then(function(result){
						deferred.resolve({
							data: result,
							msgType:'put-category',
							msg: Message.translate(myReq.CEMS.server.lang, CONST.MONGO.CATEGORY_UPDATED),
							token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
						});
					})
					.catch(function(reason){
						deferred.reject({
							msgType:'put-category',
							errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
							token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
						});
					});
			return deferred.promise;
		},
		__infoExists: function(){
			var deferred = Q.defer(),
				category_id = Utils.keyInObject('CEMS.categoryInput.category_id', myReq);
			if(category_id){
				deferred.resolve(category_id);
			}else{
				deferred.reject();
			}
			return deferred.promise;
		},
		init: function(req, res){
			myReq = req;
			myRes = res;

			Q
			.fcall(internal.__infoExists)
			.then(internal.__updateCategory)
			.then(internal.__success)
			.fail(internal.__error)
			.done();
		}
	};

	return internal;
};
