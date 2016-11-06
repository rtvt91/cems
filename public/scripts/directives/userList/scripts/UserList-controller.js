'use strict'

angular
    .module('UserListModule.controller')
    .controller('UserListController', /*@ngInject*/function(UserHTTPService, UtilsService){
        
        var that = this;
        this.list = [];

        this.internal = {
            manageData: function(result){
                var index;
                if(UtilsService.keyInObject('data', result) && result.data.length > 0){
                    angular.forEach(result.data, function(obj, id){
                        obj.compute = {
                            date: new Date(obj.date),
                            username: obj.firstname + ' ' + obj.lastname
                        };
                        if(obj._id === UtilsService.getIdFromJWT()){
                            index = id;
                        }
                    });
                    result.data.splice(index, 1);
                }
                that.list = result.data || [];
            },
            deleteUserCallback: function(result){
                that.init();
            },
            activeUserCallback: function(result){
                that.init();
            },
            getUsersCallback: function(result){
                that.internal.manageData(result);
            }
        };

        this.deleteUser = function(id){
            UserHTTPService.deleteUser(id, that.internal.deleteUserCallback);
        };

        this.activeUser = function(id, bool){
            UserHTTPService.updateUser({_id:id, active:!bool}, that.internal.activeUserCallback);
        };

        this.init = function(){
            UserHTTPService.getUsers(that.internal.getUsersCallback);
        };

        this.init();
    });