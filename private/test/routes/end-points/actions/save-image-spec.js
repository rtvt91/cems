'use strict'

var chai = require('chai'),
    Q = require('q'),
    nodeMocksHTTP = require('node-mocks-http'),
    parseDataUrl = require('parse-data-url'),
    SaveImage = require('../../../../routes/end-points/actions/save-image'),
    CONST = require('../../../../config/constant'),
    Message = require('../../../../message/message'),
    Utils = require('../../../../utils/utils'),
    reqData = require('../../../datas/req.json'),
    expect = chai.expect;

describe('SaveImage end-point', function(){

    var req, res, save;
    beforeEach(function(){

        req = nodeMocksHTTP.createRequest(reqData);
        req.CEMS.imageInput = {
            title: 'my-img',
            description: 'my superb img',
            postId: '507f1f77bcf86cd799439011',
            imgData: parseDataUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAwFBMVEXm7NK41k3w8fDv7+q01Tyy0zqv0DeqyjOszDWnxjClxC6iwCu11z6y1DvA2WbY4rCAmSXO3JZDTxOiwC3q7tyryzTs7uSqyi6tzTCmxSukwi9aaxkWGga+3FLv8Ozh6MTT36MrMwywyVBziSC01TbT5ZW9z3Xi6Mq2y2Xu8Oioxy7f572qxzvI33Tb6KvR35ilwTmvykiwzzvV36/G2IPw8O++02+btyepyDKvzzifvSmw0TmtzTbw8PAAAADx8fEC59dUAAAA50lEQVQYV13RaXPCIBAG4FiVqlhyX5o23vfVqUq6mvD//1XZJY5T9xPzzLuwgKXKslQvZSG+6UXgCnFePtBE7e/ivXP/nRvUUl7UqNclvO3rpLqofPDAD8xiu2pOntjamqRy/RqZxs81oeVzwpCwfyA8A+8mLKFku9XfI0YnSKXnSYZ7ahSII+AwrqoMmEFKriAeVrqGM4O4Z+ADZIhjg3R6LtMpWuW0ERs5zunKVHdnnnMLNQqaUS0kyKkjE1aE98b8y9x9JYHH8aZXFMKO6JFMEvhucj3Wj0kY2D92HlHbE/9Vk77mD6srRZqmVEAZAAAAAElFTkSuQmCC')
        };
        res = nodeMocksHTTP.createResponse();
        save = SaveImage();
    });

    it('should save the given image', function(done){

        save.__createImage = function(infos){
            var deferred = Q.defer();
            deferred.resolve({
                url: 'img/post/temp/myname.png',
                description: infos.description,
                msgType:'save-img',
                msg: Message.translate(req.CEMS.server.lang, CONST.POST.SUCCESS.IMG_RECORDED),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };

        save.__success = function(param){
            expect(param.url).to.equal('img/post/temp/myname.png');
            expect(param.description).to.equal(req.CEMS.imageInput.description);
            expect(param.msgType).to.equal('save-img');
            expect(param.msg).to.equal(Message.translate(req.CEMS.server.lang, CONST.POST.SUCCESS.IMG_RECORDED));
            done();
        };

        save.init(req, res);
    });

    it('should raise an error if bad credentails are given', function(done){
        var postId = req.CEMS.imageInput.postId;
        req.CEMS.imageInput.postId = '';
        save.__error = function(param){
            expect(param.msgType).to.equal('save-img');
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.POST.ERROR.IMG_CREATION_ERROR));
            req.CEMS.imageInput.postId = postId;
            done();
        };

        save.init(req, res);
    });

    it('should raise an error if the image creation has failed', function(done){

        save.__createImage = function(infos){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'save-img',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.POST.ERROR.IMG_CREATION_ERROR),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };

        save.__error = function(param){
            expect(param.msgType).to.equal('save-img');
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.POST.ERROR.IMG_CREATION_ERROR));
            done();
        };

        save.init(req, res);
    });

});