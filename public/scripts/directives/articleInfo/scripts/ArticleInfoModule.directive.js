'use strict'

angular
    .module('ArticleInfoModule.directive')
    .directive('articleInfo', /*@ngInject*/function(){

        return{
            restrict: 'E',
            scope: {},
            templateUrl: 'scripts/directives/articleInfo/template/articleInfo.htm',
            controller: 'ArticleInfoController',
            controllerAs: 'articleInfoCtrl'
        };

    });