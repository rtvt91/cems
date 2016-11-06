'use strict'

angular
    .module('NewArticleModule.controller')
    .controller('NewArticleController', /*@ngInject*/function(CategoryHTTPService, UtilsService, PostHTTPService, $location, $state){
        
        var that = this;
        this.categories = [];
        this.internal = {
            articleExistsCallback: function(result){
                if(result && result.exists === false){
                    $state.go('article', {category:that.defaultSelection.name, article:that.url});
                }
                that.alreadyExists = (result && result.exists);
            },
            getCategoryCallback: function(result){
                that.categories = UtilsService.keyInObject('data', result) || [];
                that.defaultSelection = (that.categories.length > 0)? that.categories[0] : {};
            }
        };

        this.createNewPost = function(){
            if(this.url && UtilsService.isValidUrl(this.url)){
                PostHTTPService.articleExists({category:this.defaultSelection.name, article:this.url}, that.internal.articleExistsCallback);
            }
        };

        this.init = function(){
            CategoryHTTPService.getCategory(that.internal.getCategoryCallback);
            this.rootUrl = $location.protocol() + '://' + $location.host() + '/' + $location.port();
        };

        this.init();

    });