'use strict'

angular
    .module('SliderModule.controller')
    .controller('SliderController', /*@ngInject*/function($element, $document, $scope, NotificationService, UtilsService){

        var that = this,
            imgEditorCloseNotifId,
            imgEditorOpenNotifId;

        this.internal = {
            isDraggable: false,
            $slider: $($element).find('.slider'),
            $holder: $($element).find('.holder'),
            beginAt: parseInt(this.beginAt, 10),
            rangeStart: parseInt(this.rangeStart, 10),
            rangeEnd: parseInt(this.rangeEnd, 10),
            offSetX : undefined,
            posX: undefined,
            ratio: undefined,
            setHolderPosition: function(beginPos){
                var newRangeStart = 0,
                    newRangeEnd = that.internal.$slider.width() - that.internal.$holder.width(),
                    startValue = beginPos || that.internal.beginAt;
                that.internal.posX = UtilsService.scaleRange(startValue, that.internal.rangeStart, that.internal.rangeEnd, newRangeStart, newRangeEnd);
                that.internal.$holder.css('left', that.internal.posX);
            },
            onMouseUpCallback: function(evt){
                that.internal.isDraggable = false;
                $($document).off('mousemove', that.internal.onMouseMoveCallback);
            },
            onMouseMoveCallback: function(evt){
                if(that.internal.isDraggable){
                    if(evt.clientX - that.internal.offSetX < 0){
                        that.internal.$holder.css('left', 0);
                    }else if(evt.clientX - that.internal.offSetX > that.internal.$slider.width() - that.internal.$holder.width()){
                        that.internal.$holder.css('left', that.internal.$slider.width() - that.internal.$holder.width());
                    }else{
                        that.internal.$holder.css('left', evt.clientX - that.internal.offSetX);
                    }
                    that.internal.posX = parseInt(that.internal.$holder.css('left'));
                    that.internal.ratio = UtilsService.scaleRange(that.internal.posX, 0, that.internal.$slider.width() - that.internal.$holder.width(), that.internal.rangeStart, that.internal.rangeEnd);
                    NotificationService.notify('SLIDER', {ratio:that.internal.ratio, name:that.name});
                }
            }
        };

        this.onMouseDown = function($event){
            that.internal.isDraggable = true;
            that.internal.offSetX = $event.clientX - parseInt(that.internal.$holder.css('left'));
            $($document).on('mousemove', this.internal.onMouseMoveCallback);
        };

        this.init = function(){
            this.internal.setHolderPosition();

            imgEditorCloseNotifId = NotificationService.subscribe('CLOSE_IMG_EDITOR', function(param){
                if(UtilsService.keyInObject('name', param) && UtilsService.keyInObject('beginAt', param)){
                    if($element.attr('name').toLowerCase() === param.name.toLowerCase()){
                        that.internal.setHolderPosition(param.beginAt);
                    }
                }
            });

            imgEditorOpenNotifId = NotificationService.subscribe('LAUNCH_IMG_EDITOR', function(){
                that.internal.setHolderPosition();
            });

            $($document).on('mouseup', this.internal.onMouseUpCallback);
        };

        this.init();

        $scope.$on('$destroy', function(){
            $($document).off('mouseup');
            $($document).off('mousemove');
            NotificationService.unsubscribe('CLOSE_IMG_EDITOR', imgEditorCloseNotifId);
            NotificationService.unsubscribe('LAUNCH_IMG_EDITOR', imgEditorOpenNotifId);
        });

    });