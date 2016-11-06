'use strict'

angular
    .module('ArticlesByCategoryModule.directive')
    .directive('articlesByCategory', /*@ngInject*/function(){
        
        return{
            restrict: 'E',
            scope: {},
            templateUrl: 'scripts/directives/articlesByCategory/template/articlesByCategory.htm',
            controller: 'ArticlesByCategoryController',
            controllerAs: 'articlesByCategoryCtrl'
        };

    });