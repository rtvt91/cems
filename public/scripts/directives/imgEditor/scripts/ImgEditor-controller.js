'use strict'

angular
    .module('ImgEditorModule.controller')
    .controller('ImgEditorController', /*@ngInject*/function(NotificationService, UtilsService, CanvasService, PostHTTPService, $element, $scope){

        var that = this,
            imgEditorNotifId,
            sliderNotifId;

        this.internal = {
            $canvas: $($element).find('canvas'),
            $sliders: $element.find('slider'),
            $img: $('<img />'),
            previousImgSrc: undefined,
            loadImg: function(param){
                if(UtilsService.keyInObject('src', param)){
                    this.$img.attr('src', param.src);
                    this.$img.on('load', function(evt){
                        param.src = evt.target;
                        CanvasService.build(param);
                    });
                }
            },
            saveImgCallback: function(result){
                CanvasService.destroy();
                that.init();
                NotificationService.notify('CLOSE_AND_SAVE_IMG_EDITOR', {description: result.description || '', url: result.url || 'img/post/default/default.jpg'});
            }
        };

        this.displayControl = function(str){
            this.displayable = str;
        };

        this.cancel = function(){
            this.init();
            angular.forEach(this.internal.$sliders, function(html, id){
                NotificationService.notify('CLOSE_IMG_EDITOR', {name:$(html).attr('name'), beginAt:$(html).attr('begin-at')});
            });
        };

        this.saveImg = function(){
            var data = NotificationService.getLastNotifyValue('ARTICLE_DATA');
            var sentData = {
                imgData: this.internal.$canvas.get(0).toDataURL('image/png'),
                postId: data._id,
                title: this.title,
                description: this.description,
                previousImgSrc: that.internal.previousImgSrc
            };
            PostHTTPService.saveImg(sentData, that.internal.saveImgCallback);
        };

        this.init = function(){
            this.displayable = 'SIZE_ROTATION';
            this.title = '';
            this.description = '';
            
            imgEditorNotifId = NotificationService.subscribe('LAUNCH_IMG_EDITOR', function(param){
                that.internal.$canvas.attr('width', param.width);
                that.internal.$canvas.attr('height', param.height);
                param.canvas = that.internal.$canvas;
                that.internal.previousImgSrc = param.previousImgSrc;
                that.internal.loadImg(param);
            });

            sliderNotifId = NotificationService.subscribe('SLIDER', function(param){
                if(UtilsService.keyInObject('name', param)){
                    if(param.name === 'SIZE'){
                        CanvasService.resizeBmp(param.ratio);
                    }else if(param.name === 'ROTATION'){
                        CanvasService.rotateBmp(param.ratio);
                    }else if(param.name === 'RED' || param.name === 'BLUE' || param.name === 'GREEN' || param.name === 'ALPHA'){
                        CanvasService.setRGBA(param);
                    }else if(param.name === 'BRIGHT' || param.name === 'CONTRAST' || param.name === 'HUE' || param.name === 'SATURATION'){
                        CanvasService.setBCHS(param);
                    }
                }
            });
        };

        this.init();

        $scope.$on('$destroy', function($event){
            NotificationService.unsubscribe('LAUNCH_IMG_EDITOR', imgEditorNotifId);
            NotificationService.unsubscribe('SLIDER', sliderNotifId);
        });

    });