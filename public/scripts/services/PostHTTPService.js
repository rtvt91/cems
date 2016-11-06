'use strict'

angular
    .module('app')
    .service('PostHTTPService', function($http, UtilsService, $state){

        var _error = function(data, status, headers, config){
            if(status === 401){
                $state.go('401');
            }else if(status === 404){
                $state.go('404');
            }
        };

        /*CALL API METHOD */
        this.getPosts = function(cb){
            if(angular.isFunction(cb)){
                $http.get('/api/posts').success(cb).error(_error);
            }
        };

        this.getPostByURL = function(url, cb){
            if(angular.isDefined(url) && angular.isFunction(cb)){
                $http.get('/api/posts/article-url/' + url).success(cb).error(_error);
            }
        };

        this.getPostById = function(param, cb){
            if(UtilsService.keyInObject('_id', param) && angular.isFunction(cb)){
                $http.get('/api/posts/' + param._id).success(cb).error(_error);
            }
        };

        this.getPostByCategory = function(param, cb){
            if(UtilsService.keyInObject('category_name', param) && angular.isFunction(cb)){
                $http.get('/api/posts/article-category-name/' + param.category_name).success(cb).error(_error);
            }
        };

        this.getPostByUser = function(id, cb){
            if(id && angular.isFunction(cb)){
                $http.get('/api/posts/article-user-id/' + id).success(cb).error(_error);
            }
        };

        this.postPost = function(param, cb){
            if(!UtilsService.isEmptyObject(param) && angular.isFunction(cb)){
                $http.post('/api/posts/', param).success(cb).error(_error);
            }
        };

        this.updatePost = function(post, cb){
            if(UtilsService.keyInObject('_id', post) && angular.isFunction(cb)){
                var id = post._id;
                $http.put('/api/posts/' + id, post).success(cb).error(_error);
            }
        };

        this.deletePost = function(id, cb){
            if(id && angular.isFunction(cb)){
                $http.delete('/api/posts/' + id).success(cb).error(_error);
            }
        };

        /*CALL ACTION METHOD */
        this.saveImg = function(param, cb){
            if(!UtilsService.isEmptyObject(param) && angular.isFunction(cb)){
                $http.post('/action/save-img', param).success(cb).error(_error);
            }
        };

        this.articleExists = function(param, cb){
            if(UtilsService.keyInObject('category', param) && UtilsService.keyInObject('article', param) && angular.isFunction(cb)){
                $http.post('/action/article-exists', param).success(cb).error(_error);
            }
        };

    });