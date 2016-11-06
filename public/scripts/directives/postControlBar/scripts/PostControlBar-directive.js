'use strict'

angular
    .module('PostControlBarModule.directive')
    .directive('postControlBar', /*@ngInject*/function(){

        return{
            restrict: 'E',
            scope: {},
            templateUrl: 'scripts/directives/postControlBar/template/postControlBar.htm',
            controller: 'PostControlBarController',
            controllerAs: 'postControlBarCtrl'
        };

    });