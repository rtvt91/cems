'use strict'

angular
    .module('KeyshortcutModule.controller')
    .controller('KeyshortcutController', /*@ngInject*/function($document, $state, NotificationService){
        var $doc = angular.element($document);

        $doc.on('keydown', function($event){
            var altDown = $event.altKey,
                keyCode = $event.keyCode || $event.which;
            if(altDown){
                if(keyCode === 76){
                    var isOpen = NotificationService.getLastNotifyValue('BANNER');
                    NotificationService.notify('BANNER', !isOpen);
                }else if(keyCode === 80){
                    $state.go('dashboard.user-info');
                }else if(keyCode === 81){
                    NotificationService.notify('SHORTCUT_DECONNECT');
                }else if(keyCode === 83){
                    NotificationService.notify('SHORTCUT_SAVE', 'save');
                }else if(keyCode === 72){
                    $state.go('home');
                }
            }
        });
    });