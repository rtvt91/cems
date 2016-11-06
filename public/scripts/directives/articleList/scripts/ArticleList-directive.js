'use strict'

angular
    .module('ArticleListModule.directive')
    .directive('articleList', function(){

        return{
            restrict: 'E',
            scope: {},
            templateUrl: 'scripts/directives/articleList/template/articleList.htm',
            controller: 'ArticleListController',
            controllerAs: 'articleCtrl'
        };

    });