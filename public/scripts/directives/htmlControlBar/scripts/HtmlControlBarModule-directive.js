'use strict'

angular
    .module('HtmlControlBarModule.directive')
    .directive('htmlControlBar', /*@ngInject*/function(){
        return{
            restrict: 'E',
            scope: {},
            templateUrl: 'scripts/directives/htmlControlBar/template/htmlControlBar.htm',
            controller: 'HtmlControlBarController',
            controllerAs: 'htmlControlBarCtrl'
        };
    });