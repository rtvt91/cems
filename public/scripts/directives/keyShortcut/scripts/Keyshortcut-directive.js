'use strict'

angular
    .module('KeyshortcutModule.directive')
    .directive('keyshortcut', function(){
        return{
            restrict: 'A',
            controller: 'KeyshortcutController'
        };
    });