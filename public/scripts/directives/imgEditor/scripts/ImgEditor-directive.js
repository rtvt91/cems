'use strict'

angular
    .module('ImgEditorModule.directive')
    .directive('imgEditor', function(){
        return{
            restrict: 'E',
            scope: {},
            templateUrl: 'scripts/directives/imgEditor/template/imgEditor.htm',
            controller: 'ImgEditorController',
            controllerAs: 'imgEditor'
        }
    });