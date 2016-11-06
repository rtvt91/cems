'use strict'

angular
    .module('UserListModule.directive')
    .directive('userList', function(){

        return{
            restrict: 'E',
            scope: {},
            templateUrl: 'scripts/directives/userList/template/userList.htm',
            controller: 'UserListController',
            controllerAs: 'userCtrl'
        };

    });