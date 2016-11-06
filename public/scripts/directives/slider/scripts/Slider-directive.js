'use strict'

angular
    .module('SliderModule.directive')
    .directive('slider', function(){

        return{
            restrict: 'E',
            scope: {
                name: '@name',
                beginAt: '@beginAt',
                rangeStart: '@rangeStart',
                rangeEnd: '@rangeEnd'
            },
            templateUrl: 'scripts/directives/slider/template/slider.htm',
            controller: 'SliderController',
            controllerAs: 'slider',
            bindToController: true
        };
        
    });