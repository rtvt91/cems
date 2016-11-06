'use strict'

angular
    .module('NewArticleModule.directive')
    .directive('newArticle', /*@ngInject*/function(){
        
        return{
            restrict: 'E',
            scope: {},
            templateUrl: 'scripts/directives/newArticle/template/newArticle.htm',
            controller: 'NewArticleController',
            controllerAs: 'newArticleCtrl'
        };

    });