'use strict'

angular
    .module('PopupModule.directive')
    .directive('popup', /*@ngInject*/function(){

        return{
            restrcit: 'A',
            scope: {},
            templateUrl: 'scripts/directives/popup/template/popup.htm',
            controller: 'PopupController',
            controllerAs: 'popupCtrl'
        };

    });