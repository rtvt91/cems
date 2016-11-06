'use strict'

describe('SliderController', function(){

    var SliderController,
        NotificationService,
        UtilsService,
        $scope,
        $element,
        $document;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function($controller, $rootScope, _$document_, _NotificationService_, _UtilsService_){
            NotificationService = _NotificationService_;
            UtilsService = _UtilsService_;
            $scope = $rootScope.$new();
            $element = angular.element('<div name="SIZE"><p class="slider"></p><p class="holder"></p></div>');
            $($element).find('.slider').width('120px');
            $($element).find('.holder').width('10px');

            $document = _$document_;

            SliderController = $controller('SliderController', {$scope:$scope, $element:$element}, {beginAt:1, rangeStart:0, rangeEnd:1, name:'SIZE'});
        });
    });

    describe('#internal.setHolderPosition', function(){

        it('should set the holder position', function(){

            SliderController.internal.setHolderPosition(0.5);

            expect(SliderController.internal.posX).toEqual(55);
            expect(SliderController.internal.$holder.css('left')).toEqual('55px');
        });

    });

    describe('#internal.onMouseUpCallback', function(){

        it('should', function(){
            var evt = $.Event('mouseup');

            expect(SliderController.internal.isDraggable).toEqual(false);
        });

    });

    describe('#internal.onMouseMoveCallback', function(){

        it('should set the holder position, ratio and notify SLIDER notification', function(){
            SliderController.internal.offSetX = 10;
            SliderController.internal.isDraggable = true;
            var evt = $.Event('mousemove', {
                clientX: 50
            });
            spyOn(NotificationService, 'notify');

            SliderController.internal.onMouseMoveCallback(evt);

            expect(SliderController.internal.posX).toEqual(40);
            expect(SliderController.internal.$holder.css('left')).toEqual('40px');
            expect(NotificationService.notify).toHaveBeenCalled();
        });

    });

    describe('#onMouseDown', function(){

        it('should set the holder position, ratio and notify SLIDER notification', function(){
            var evt = $.Event('mousedown', {
                clientX: 50
            });

            SliderController.onMouseDown(evt);

            expect(SliderController.internal.isDraggable).toEqual(true);
            expect(SliderController.internal.offSetX).toEqual(-60);
        });

    });

    describe('#init', function(){

        it('should set the holder position, ratio and notify SLIDER notification', function(){
            spyOn(SliderController.internal, 'setHolderPosition');
            spyOn(NotificationService, 'subscribe');

            SliderController.init();

            expect(SliderController.internal.setHolderPosition).toHaveBeenCalled();
            expect(NotificationService.subscribe.calls.count()).toEqual(2);
        });

        it('should set the holder position when CLOSE_IMG_EDITOR notification is received', function(){
            spyOn(SliderController.internal, 'setHolderPosition');

            NotificationService.notify('CLOSE_IMG_EDITOR', {name:'SIZE', beginAt:10});

            expect(SliderController.internal.setHolderPosition).toHaveBeenCalledWith(10);
        });

        it('should set the holder position when LAUNCH_IMG_EDITOR notification is received', function(){
            spyOn(SliderController.internal, 'setHolderPosition');

            NotificationService.notify('LAUNCH_IMG_EDITOR');

            expect(SliderController.internal.setHolderPosition).toHaveBeenCalled();
        });

    });

    describe('#destroy', function(){

        it('should unsubscribe to CLOSE_IMG_EDITOR and LAUNCH_IMG_EDITOR', function(){
            spyOn(NotificationService, 'unsubscribe');

            $scope.$destroy();

            expect(NotificationService.unsubscribe.calls.count()).toEqual(2);
        });

    });

});