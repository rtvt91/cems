'use strict'

angular
    .module('CategoryListModule.directive')
    .directive('categoryList', function(){

        return{
            restrict: 'E',
            scope: {},
            templateUrl: 'scripts/directives/categoryList/template/categoryList.htm',
            controller: 'CategoryListController',
            controllerAs: 'categoryListCtrl'
        };

    });