'use strict'

angular
    .module('BannerModule.directive')
    .directive('banner', /*@ngInject*/function(){

        return{
            restrict: 'E',
            scope: {},
            templateUrl: 'scripts/directives/banner/template/banner.htm',
            controllerAs: 'banner',
            controller: 'BannerController'
        };

    });