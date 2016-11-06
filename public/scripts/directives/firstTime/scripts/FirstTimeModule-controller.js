'use strict'

angular
    .module('FirstTimeModule.controller')
    .controller('FirstTimeController', /*@ngInject*/function(UserHTTPService, UtilsService, $window){

        var that = this;

        this.internal = {
            firstTimeCallback: function(result){
                if(UtilsService.keyInObject('msgType', result) !== 'first-user'){
                    $window.location.reload();
                }
            }
        };

        this.createUser = function(user){
            UserHTTPService.firstTime(user, that.internal.firstTimeCallback);
        };

    });