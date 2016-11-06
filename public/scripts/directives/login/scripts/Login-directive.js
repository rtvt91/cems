'use strict'


angular
    .module('LoginModule.directive')
    .directive('login', function(){
        return{
            restrict: 'E',
            scope: {},
            templateUrl: 'scripts/directives/login/template/login.htm',
            controllerAs: 'loginCtrl',
            controller: 'LoginController'
        };
    });