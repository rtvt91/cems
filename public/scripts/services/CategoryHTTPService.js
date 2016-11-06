'use strict'

angular
    .module('app')
    .service('CategoryHTTPService', function($http, UtilsService, $state){

        var _error = function(data, status, headers, config){
            if(status === 401){
                $state.go('401');
            }else if(status === 404){
                $state.go('404');
            }
        };

        /*CALL API METHOD */
        this.getCategory = function(cb){
            if(angular.isFunction(cb)){
                $http.get('/api/categories').success(cb).error(_error);
            }
        };

        this.postCategory = function(param, cb){
            if(!UtilsService.isEmptyObject(param) && angular.isFunction(cb)){
                $http.post('/api/categories/', param).success(cb).error(_error);
            }
        };

        this.updateCategory = function(data, cb){
            if(UtilsService.keyInObject('_id', data) && angular.isFunction(cb)){
                var id = data._id;
                $http.put('/api/categories/' + id, data).success(cb).error(_error);
            }
        };

        this.deleteCategory = function(id, cb){
            if(id && angular.isFunction(cb)){
                $http.delete('/api/categories/' + id).success(cb).error(_error);
            }
        };

    });