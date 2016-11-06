'use strict'

angular
    .module('UserInfoModule.directive')
    .directive('userInfo', /*@ngInject*/function(){

        return{
            restrict: 'E',
            scope: {},
            templateUrl: 'scripts/directives/userInfo/template/userInfo.htm',
            controller: 'UserInfoController',
            controllerAs: 'userInfoCtrl'
        };

    });