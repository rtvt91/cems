'use strict'

angular
    .module('EditableImgModule.directive')
    .directive('editableImg', /*@ngInject*/function(UtilsService){

        return{
            restrict: 'E',
            scope: {},
            templateUrl: 'scripts/directives/editableImg/template/editableImg.htm?date=' + new Date(),
            controller: 'EditableImgController',
            controllerAs: 'editableImg',
            transclude: true,
            link: function(scope, element, attrs, ctrl){
                var $img = element.find('img');
                $img.on('load', function(evt){
                    ctrl.img.width = evt.target.width;
                    ctrl.img.height = evt.target.height;
                    ctrl.img.element = $img;
                    $img.off('load');
                });
                element.on('dragover', ctrl.onDragover);
                element.on('drop', ctrl.onDrop);
            }
        };

    });