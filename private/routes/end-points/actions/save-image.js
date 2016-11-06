'use strict'

var fs = require('fs'),
    path = require('path'),
    Q = require('q'),
    Post = require('../../../mongo-models/post'),
    Category = require('../../../mongo-models/category'),
    CONST = require('../../../config/constant'),
    Message = require('../../../message/message'),
    Utils = require('../../../utils/utils');

module.exports = function(){

    var myReq, myRes;
    var internal = {
        __error: function(param){
            myRes.json(param);
        },
        __success: function(param){
            myRes.json(param);
        },
        __createImage: function(infos){
            var deferred = Q.defer(),
                folderLocation = '../../../../public/img/post/temp',
                folderUrl = path.join(__dirname, folderLocation),
                toBuffer = Utils.keyInObject('imgData.toBuffer', infos);
            if(toBuffer){
                Utils.createFolder(folderUrl);
                var buffer = toBuffer(),
                    extension = infos.imgData.mediaType.split('/'),
                    imgName = (Utils.keyInObject('CEMS.jwt.validateDecodedToken.id', myReq)) + '_' + (infos.title) + '.' + (extension[1]),
                    imgLocation = folderLocation + '/' + imgName,
                    imgUrl = path.join(__dirname,  imgLocation);
                Utils.createImage({url:imgUrl, buffer:buffer}, function(err){
                    if(err){
                        deferred.reject({
                            msgType:'save-img',
                            errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.POST.ERROR.IMG_CREATION_ERROR),
                            token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                        });
                    }else{
                        deferred.resolve({
                            url: 'img/post/temp/' + imgName,
                            description: infos.description,
                            msgType:'save-img',
                            msg: Message.translate(myReq.CEMS.server.lang, CONST.POST.SUCCESS.IMG_RECORDED),
                            token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                        });
                    }
                });
                return deferred.promise;
            }
        },
        __infoExists: function(){
            var deferred = Q.defer(),
                title = Utils.keyInObject('CEMS.imageInput.title', myReq),
                description = Utils.keyInObject('CEMS.imageInput.description', myReq),
                postId = Utils.keyInObject('CEMS.imageInput.postId', myReq),
                imgData = Utils.keyInObject('CEMS.imageInput.imgData', myReq);
            if(title && description && postId && imgData){
                deferred.resolve({
                    title: title,
                    description: description,
                    postId: postId,
                    imgData: imgData
                });
            }else{
                deferred.reject({
                    msgType:'save-img',
                    errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.POST.ERROR.IMG_CREATION_ERROR),
                    token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                });
            }
            return deferred.promise;
        },
        init: function(req, res){
            myReq = req;
            myRes = res;

            Q
            .fcall(internal.__infoExists)
            .then(internal.__createImage)
            .then(internal.__success)
            .fail(internal.__error)
            .done()
        }
    };

    return internal;
};