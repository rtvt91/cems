'use strict'

angular
    .module('ArticlesByCategoryModule.controller')
    .controller('ArticlesByCategoryController', /*@ngInject*/function(UtilsService, PostHTTPService, $stateParams, $state, $sanitize){

        var that = this;
        this.articles = [];
        this.categoryName = '';
        this.internal = {
            manageData: function(param){
                if(UtilsService.keyInObject('data', param) && param.data.length > 0){
                    var posts = param.data;
                    angular.forEach(posts, function(obj, id){
                        obj.compute = {
                            h1: $sanitize(obj.h1),
                            h2: $sanitize(obj.h2),
                            div: $sanitize(obj.div),
                            date: new Date(obj.date),
                            url: (obj.categoryId)? (obj.categoryId.name + '/' + obj.url) : '',
                            username: (obj.userId)? (obj.userId.firstname + ' ' + obj.userId.lastname) : 'DELETED USER'
                        };
                    });
                }
                that.articles = posts || [];
            }
        };

        this.gotoArticle = function(cat, art){
            $state.go('article', {category: cat, article: art});
        };

        this.isConnectedUser = function(userId){
            return userId === UtilsService.getIdFromJWT();
        };
        
        this.init = function(){
            var name = UtilsService.keyInObject('name', $stateParams);
            if(name){
                this.categoryName = name;
                PostHTTPService.getPostByCategory({category_name:name}, this.internal.manageData);
            }
        };

        this.init();

    });