'use strict'

angular
    .module('EditableContentModule.directive')
    .directive('editableContent', /*@ngInject*/function(){
        return{
            restrict: 'A',
            scope: {},
            controller: 'EditableContentController'
        };
    });