'use strict'

angular
    .module('FirstTimeModule.directive')
    .directive('firstTime', function(){

        return{
            restrict: 'E',
            scope: {},
            templateUrl: 'scripts/directives/firstTime/template/firstTime.htm',
            controller: 'FirstTimeController',
            controllerAs: 'firstTimeCtrl'
        };

    });