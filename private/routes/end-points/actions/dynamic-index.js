'use strict'

var path = require('path'),
    fs = require('fs'),
    Q = require('q');

module.exports = function(){
    var myReq, myRes;
    var internal = {
        __sendHTMLFile: function(firstTime){
            var url = (firstTime.start) ? path.join(__dirname, '../../html/first-time.html') : path.join(__dirname, '../../html/index.html');
            myRes.sendFile(url);
        },
        __readFile: function(){
            var deferred = Q.defer(),
                ftPath = path.join(__dirname, '../../../config/first-time.json');
            fs.readFile(ftPath, function(err, data){
                if(err){
                    deferred.resolve(JSON.parse({start:false}));
                }else if(data){
                    deferred.resolve(JSON.parse(data));
                }
            });
            return deferred.promise;
        },
        init: function(req, res){
            myReq = req;
            myRes = res;
            Q
            .fcall(internal.__readFile)
            .then(internal.__sendHTMLFile)
            .done();
        }
    };

    return internal;
};