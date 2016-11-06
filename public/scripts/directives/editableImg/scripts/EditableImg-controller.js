'use strict'

angular
    .module('EditableImgModule.controller')
    .controller('EditableImgController', /*@ngInject*/function($scope, $element, NotificationService, FileReaderFactory, UtilsService){

        var that = this,
            fileReaderNotifId,
            userDataNotifId,
            imgEditorCloseAndSaveNotifId,
            imgEditorCloseNotifId;

        this.img = {
            isDisplayable: true,
            previousImg: ''
        };

        this.onDragover = function(evt){
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy';
        };

        this.onDrop = function(evt){
            evt.stopPropagation();
            evt.preventDefault();
            if(that.img.isDisplayable && that.internal.isEditable()){
                var file = evt.dataTransfer.files[0];
                FileReaderFactory.build(file);
            }
            return false;
        };

        this.internal = {
            isEditable: function(result){
                var articleData = (result)? result : NotificationService.getLastNotifyValue('ARTICLE_DATA');
                if(UtilsService.keyInObject('creator._id', articleData)){
                    return (articleData.creator._id === UtilsService.getIdFromJWT());
                }else{
                    return false;
                }
            }
        };

        this.init = function(){
            fileReaderNotifId = NotificationService.subscribe('FILE_READER', function(param){
                if(UtilsService.keyInObject('name', param) && UtilsService.keyInObject('src', param) && param.name === 'file_loadcomplete'){
                    $scope.$apply(function(){
                        that.img.isDisplayable = false;
                    });
                    NotificationService.notify('LAUNCH_IMG_EDITOR', {width: that.img.width, height: that.img.height, src:param.src, previousImgSrc: $($element).find('img').attr('src')});
                }
            });
            
            userDataNotifId = NotificationService.subscribe('USER_DATA', function(result){
                var data = UtilsService.keyInObject('data', result);
                if(UtilsService.isEmptyObject(data)){
                    FileReaderFactory.destroy();
                    that.img.isDisplayable = true;
                }
            });

            imgEditorCloseAndSaveNotifId = NotificationService.subscribe('CLOSE_AND_SAVE_IMG_EDITOR', function(param){
                that.img.isDisplayable = true;
                FileReaderFactory.destroy();
                if(!UtilsService.isEmptyObject(param)){
                    $($element).find('img')
                        .attr('src', param.url + '?' + new Date().getTime())
                        .attr('alt', param.description)
                        .attr('title', param.description);
                }
            });

            imgEditorCloseNotifId = NotificationService.subscribe('CLOSE_IMG_EDITOR', function(){
                that.img.isDisplayable = true;
            });
        };

        this.init();

        $scope.$on('$destroy', function(){
            NotificationService.unsubscribe('FILE_READER', fileReaderNotifId);
            NotificationService.unsubscribe('USER_DATA', userDataNotifId);
            NotificationService.unsubscribe('CLOSE_AND_SAVE_IMG_EDITOR', imgEditorCloseAndSaveNotifId);
            NotificationService.unsubscribe('CLOSE_IMG_EDITOR', imgEditorCloseNotifId);
            FileReaderFactory.destroy();
        });
    });