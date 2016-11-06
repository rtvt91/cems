'use strict'

describe('EditableContentController', function(){

    var EditableContentController,
        UtilsService,
        NotificationService,
        $element,
        $scope;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function($controller, $rootScope, _UtilsService_, _NotificationService_){
            UtilsService = _UtilsService_;
            NotificationService = _NotificationService_;
            $scope = $rootScope.$new();
            $element = angular.element('<div>Lorem ipsum</div>');

            EditableContentController = $controller('EditableContentController', {$scope:$scope, $element:$element});
        });
    });

    describe('#destroyMediumEditor', function(){
        
        it('should destroy medium-editor object', function(){
            EditableContentController.buildMediumEditor();
            EditableContentController.destroyMediumEditor();

            expect(EditableContentController.props.editor).toBeUndefined();
        });
    });

    describe('#buildMediumEditor', function(){
        
        it('should build medium-editor object', function(){
            EditableContentController.buildMediumEditor();

            expect(EditableContentController.props.editor).toBeDefined();
        });
    });

    describe('#internal.isEditable', function(){
        
        it('should return true if user is connected', function(){
            NotificationService.notify('ARTICLE_DATA', {creator:{_id: '3126596565dd'}});
            spyOn(UtilsService, 'getIdFromJWT').and.returnValue('3126596565dd');

            var test = EditableContentController.internal.isEditable();

            expect(test).toEqual(true);
        });

        it('should return false if user is connected', function(){
            NotificationService.notify('ARTICLE_DATA', {});
            spyOn(UtilsService, 'getIdFromJWT').and.returnValue('3126596565dd');

            var test = EditableContentController.internal.isEditable();

            expect(test).toEqual(false);
        });

    });

    describe('#internal.buildEditor', function(){
        
        it('should create a medium-editor for the element', function(){
            spyOn(EditableContentController.internal, 'isEditable').and.returnValue(true);
            spyOn(EditableContentController, 'buildMediumEditor');

            EditableContentController.internal.buildEditor();

            expect(EditableContentController.buildMediumEditor).toHaveBeenCalled();
        });

        it('should destroy a medium-editor for the element', function(){
            EditableContentController.props.editor = {};
            spyOn(EditableContentController.internal, 'isEditable').and.returnValue(false);
            spyOn(EditableContentController, 'destroyMediumEditor');

            EditableContentController.internal.buildEditor();

            expect(EditableContentController.destroyMediumEditor).toHaveBeenCalled();
        });

    });

    describe('#init', function(){

        it('should get the last notify value', function(){
            spyOn(NotificationService, 'getLastNotifyValue');

            EditableContentController.init();

            expect(NotificationService.getLastNotifyValue).toHaveBeenCalledWith('USER_DATA');
        });

        it('should build a medium-editor', function(){
            NotificationService.notify('USER_DATA', {firstname:'John', lastname:'Doe'});
            spyOn(EditableContentController.internal, 'isEditable').and.returnValue(true);
            spyOn(EditableContentController, 'buildMediumEditor');

            EditableContentController.init();

            expect(EditableContentController.buildMediumEditor).toHaveBeenCalled();
        });

        it('should subscribe to USER_DATA and ARTICLE_DATA NotificationService', function(){
            spyOn(NotificationService, 'subscribe');

            EditableContentController.init();

            expect(NotificationService.subscribe.calls.count()).toEqual(2);
        });

        it('should manage the focus element', function(){
            $element.text('Type your text here');
            $element.triggerHandler('focus');

            expect($element.text()).toEqual('');
        });

        it('should manage the blur element', function(){
            $element.text('');
            $element.triggerHandler('blur');

            expect($element.text()).toEqual('Type your text here');
        });

        it('should manage the double click on element', function(){
            spyOn(EditableContentController.internal, 'isEditable').and.returnValue(true);
            spyOn(NotificationService, 'notify');
            $element.triggerHandler('dblclick');

            expect(NotificationService.notify).toHaveBeenCalled();
        });

    });

    describe('#destroy', function(){

        it('should unsubscribe USER_DATA and ARTICLE_DATA NotificationService', function(){
            spyOn(NotificationService, 'unsubscribe');

            $scope.$destroy();

            expect(NotificationService.unsubscribe.calls.count()).toEqual(2);
        });

    });

});