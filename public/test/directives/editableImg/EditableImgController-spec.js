'use strict'

describe('EditableImgController', function(){

    var EditableImgController,
        NotificationService,
        FileReaderFactory,
        UtilsService,
        $scope,
        $element;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function($controller, $rootScope, _NotificationService_, _FileReaderFactory_, _UtilsService_){
            NotificationService = _NotificationService_;
            FileReaderFactory = _FileReaderFactory_;
            UtilsService = _UtilsService_;
            $scope = $rootScope.$new();
            $element = angular.element('<img src="" title="" alt=""/>');

            EditableImgController = $controller('EditableImgController', {$scope:$scope, $element:$element});
        });
    });

    describe('#onDragover', function(){

        it('it should prevent default behavior on dragover event', function(){
            var evt = $.Event('dragover', {dataTransfer: { files: [] }});
            spyOn(evt, 'stopPropagation');
            spyOn(evt, 'preventDefault');

            EditableImgController.onDragover(evt);

            expect(evt.stopPropagation).toHaveBeenCalled();
            expect(evt.preventDefault).toHaveBeenCalled();
        });

    });

    describe('#onDrop', function(){

        it('it should prevent default behavior on dragover event', function(){
            var evt = $.Event('dragover', {dataTransfer: { files: [] }});
            spyOn(evt, 'stopPropagation');
            spyOn(evt, 'preventDefault');
            spyOn(EditableImgController.internal, 'isEditable').and.returnValue(true);
            spyOn(FileReaderFactory, 'build');

            EditableImgController.onDrop(evt);

            expect(evt.stopPropagation).toHaveBeenCalled();
            expect(evt.preventDefault).toHaveBeenCalled();
            expect(FileReaderFactory.build).toHaveBeenCalled();
        });

    });

    describe('#internal.isEditable', function(){
        
        it('should return true if user is connected', function(){
            spyOn(NotificationService, 'getLastNotifyValue').and.returnValue({creator:{_id: '3126596565dd'}});
            spyOn(UtilsService, 'getIdFromJWT').and.returnValue('3126596565dd');

            var test = EditableImgController.internal.isEditable();

            expect(test).toEqual(true);
        });

        it('should return false if user is connected', function(){
            spyOn(NotificationService, 'getLastNotifyValue').and.returnValue({});
            spyOn(UtilsService, 'getIdFromJWT').and.returnValue('3126596565dd');

            var test = EditableImgController.internal.isEditable();

            expect(test).toEqual(false);
        });

    });

    describe('#init', function(){

        it('should subscribe to FILE_READER, USER_DATA, CLOSE_AND_SAVE_IMG_EDITOR, and CLOSE_IMG_EDITOR NotificationService', function(){
            spyOn($scope, '$apply').and.callFake(function(){
                return true;
            });
            spyOn(NotificationService, 'subscribe');

            EditableImgController.init();

            expect(NotificationService.subscribe.calls.count()).toEqual(4);
        });

        it('should notify LAUNCH_IMG_EDITOR when FILE_READER NotificationService is notified', function(){
            spyOn(NotificationService, 'notify');

            NotificationService.notify('FILE_READER', {name:'file_loadcomplete', src:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/'});

            expect(NotificationService.notify).toHaveBeenCalled();
        });

        it('should destroy FileReaderFactory when USER_DATA NotificationService is notified', function(){
            spyOn(FileReaderFactory, 'destroy');
            EditableImgController.img.isDisplayable = false;

            NotificationService.notify('USER_DATA', {data:{}});

            expect(FileReaderFactory.destroy).toHaveBeenCalled();
            expect(EditableImgController.img.isDisplayable).toEqual(true);
        });

        it('should destroy FileReaderFactory when CLOSE_AND_SAVE_IMG_EDITOR NotificationService is notified', function(){
            spyOn(FileReaderFactory, 'destroy');
            EditableImgController.img.isDisplayable = false;

            NotificationService.notify('CLOSE_AND_SAVE_IMG_EDITOR', {data:{url:'img/post/default/default.jpg', description:'default'}});

            expect(FileReaderFactory.destroy).toHaveBeenCalled();
            expect(EditableImgController.img.isDisplayable).toEqual(true);
        });

        it('should set the isDisplayable when CLOSE_IMG_EDITOR NotificationService is notified', function(){
            EditableImgController.img.isDisplayable = false;

            NotificationService.notify('CLOSE_IMG_EDITOR');

            expect(EditableImgController.img.isDisplayable).toEqual(true);
        });

    });

    describe('#destroy', function(){

        it('should subscribe to FILE_READER, USER_DATA, CLOSE_AND_SAVE_IMG_EDITOR, and CLOSE_IMG_EDITOR NotificationService', function(){
            spyOn(NotificationService, 'unsubscribe');
            spyOn(FileReaderFactory, 'destroy');

            $scope.$destroy();

            expect(NotificationService.unsubscribe.calls.count()).toEqual(4);
            expect(FileReaderFactory.destroy).toHaveBeenCalled();
        });

    });

});