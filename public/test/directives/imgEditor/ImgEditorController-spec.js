'use strict'

describe('ImgEditorController', function(){

    var ImgEditorController,
        NotificationService,
        UtilsService,
        CanvasService,
        PostHTTPService,
        $element,
        $scope;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function($controller, $rootScope, _NotificationService_, _UtilsService_, _CanvasService_, _PostHTTPService_){
            NotificationService = _NotificationService_;
            UtilsService = _UtilsService_;
            CanvasService = _CanvasService_;
            PostHTTPService = _PostHTTPService_;
            $scope = $rootScope.$new();
            $element = $('<div><canvas></canvas><slider name="SIZE" begin-at="1" range-start="0" range-end="1"></slider></div>');

            ImgEditorController = $controller('ImgEditorController', {$scope:$scope, $element:$element});
        });
    });

    describe('#internal.loadImg', function(){

        it('should create and load an image from data uri', function(){
            spyOn(ImgEditorController.internal.$img, 'attr');
            spyOn(ImgEditorController.internal.$img, 'on');

            ImgEditorController.internal.loadImg({src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAwFBMVEXm7NK41k3w8fDv7+q01Tyy0zqv0DeqyjOszDWnxjClxC6iwCu11z6y1DvA2WbY4rCAmSXO3JZDTxOiwC3q7tyryzTs7uSqyi6tzTCmxSukwi9aaxkWGga+3FLv8Ozh6MTT36MrMwywyVBziSC01TbT5ZW9z3Xi6Mq2y2Xu8Oioxy7f572qxzvI33Tb6KvR35ilwTmvykiwzzvV36/G2IPw8O++02+btyepyDKvzzifvSmw0TmtzTbw8PAAAADx8fEC59dUAAAA50lEQVQYV13RaXPCIBAG4FiVqlhyX5o23vfVqUq6mvD//1XZJY5T9xPzzLuwgKXKslQvZSG+6UXgCnFePtBE7e/ivXP/nRvUUl7UqNclvO3rpLqofPDAD8xiu2pOntjamqRy/RqZxs81oeVzwpCwfyA8A+8mLKFku9XfI0YnSKXnSYZ7ahSII+AwrqoMmEFKriAeVrqGM4O4Z+ADZIhjg3R6LtMpWuW0ERs5zunKVHdnnnMLNQqaUS0kyKkjE1aE98b8y9x9JYHH8aZXFMKO6JFMEvhucj3Wj0kY2D92HlHbE/9Vk77mD6srRZqmVEAZAAAAAElFTkSuQmCC",
            });

            expect(ImgEditorController.internal.$img.attr).toHaveBeenCalled();
            expect(ImgEditorController.internal.$img.on).toHaveBeenCalled();
        });

    });

    describe('#internal.saveImgCallback', function(){

        it('should destroy the canvas and notify CLOSE_AND_SAVE_IMG_EDITOR notification', function(){
            spyOn(CanvasService, 'destroy');
            spyOn(ImgEditorController, 'init');
            spyOn(NotificationService, 'notify');

            ImgEditorController.internal.saveImgCallback({description: 'my new image', url: 'img/post/temp/my-new-image.png'});

            expect(CanvasService.destroy).toHaveBeenCalled();
            expect(ImgEditorController.init).toHaveBeenCalled();
            expect(NotificationService.notify).toHaveBeenCalled();
        });

    });

    describe('#displayControl', function(){

        it('should set the displayable property', function(){
            ImgEditorController.displayControl('SIZE_ROTATION');

            expect(ImgEditorController.displayable).toEqual('SIZE_ROTATION');
        });

    });

    describe('#cancel', function(){

        it('should notify the CLOSE_IMG_EDITOR notification', function(){
            spyOn(ImgEditorController, 'init');
            spyOn(NotificationService, 'notify');

            ImgEditorController.cancel();

            expect(ImgEditorController.init).toHaveBeenCalled();
            expect(NotificationService.notify).toHaveBeenCalledWith('CLOSE_IMG_EDITOR', {name:'SIZE', beginAt:'1'});
        });

    });

    describe('#saveImg', function(){

        it('should save the image', function(){
            spyOn(NotificationService, 'getLastNotifyValue').and.returnValue('245564');
            spyOn(PostHTTPService, 'saveImg');

            ImgEditorController.saveImg();

            expect(PostHTTPService.saveImg).toHaveBeenCalled();
        });

    });

    describe('#init', function(){

        it('should init the controller', function(){
            spyOn(NotificationService, 'subscribe');

            ImgEditorController.init();

            expect(ImgEditorController.displayable).toEqual('SIZE_ROTATION');
            expect(ImgEditorController.title).toEqual('');
            expect(ImgEditorController.description).toEqual('');
            expect(NotificationService.subscribe.calls.count()).toEqual(2);
        });

        it('should configure the canvas when LAUNCH_IMG_EDITOR notification is received', function(){
            spyOn(CanvasService, 'build');
            spyOn(ImgEditorController.internal, 'loadImg');

            NotificationService.notify('LAUNCH_IMG_EDITOR', {
                width: 800,
                height: 200,
                previousImgSrc: 'img/post/temp/my-new-image.png'
            });

            expect(ImgEditorController.internal.loadImg).toHaveBeenCalled();
            expect(ImgEditorController.internal.$canvas.attr('width')).toEqual('800');
            expect(ImgEditorController.internal.$canvas.attr('height')).toEqual('200');
            expect(ImgEditorController.internal.previousImgSrc).toEqual('img/post/temp/my-new-image.png');
        });

        it('should configure the CanvasService when SLIDER notification is received', function(){
            spyOn(CanvasService, 'resizeBmp');
            spyOn(CanvasService, 'rotateBmp');
            spyOn(CanvasService, 'setRGBA');
            spyOn(CanvasService, 'setBCHS');

            NotificationService.notify('SLIDER', {name:'SIZE', ratio:0.8});
            NotificationService.notify('SLIDER', {name:'ROTATION', ratio:0.1});
            NotificationService.notify('SLIDER', {name:'RED', ratio:0.5});
            NotificationService.notify('SLIDER', {name:'BRIGHT', ratio:0.7});

            expect(CanvasService.resizeBmp).toHaveBeenCalledWith(0.8);
            expect(CanvasService.rotateBmp).toHaveBeenCalledWith(0.1);
            expect(CanvasService.setRGBA).toHaveBeenCalledWith({name:'RED', ratio:0.5});
            expect(CanvasService.setBCHS).toHaveBeenCalledWith({name:'BRIGHT', ratio:0.7});
        });

    });

    describe('#destroy', function(){

        it('should unsubscribe to LAUNCH_IMG_EDITOR and SLIDER NotificationService', function(){
            spyOn(NotificationService, 'unsubscribe');

            $scope.$destroy();

            expect(NotificationService.unsubscribe.calls.count()).toEqual(2);
        });

    });

});