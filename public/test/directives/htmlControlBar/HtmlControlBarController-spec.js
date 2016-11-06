'use strict'

describe('HtmlControlBarController', function(){

    var HtmlControlBarController,
        NotificationService,
        UtilsService,
        $scope, 
        $element,
        $compile;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function($controller, $rootScope, _NotificationService_, _UtilsService_, _$compile_){
            NotificationService = _NotificationService_;
            UtilsService = _UtilsService_;
            $scope = $rootScope.$new();
            $element = angular.element('<div>Lorem ipsum</div>');

            HtmlControlBarController = $controller('HtmlControlBarController', {$scope:$scope, $element:$element});
        });
    });

    describe('#closeControl', function(){

        it('should set toggle and htmlTag properties, and call internal.removeControlBar', function(){
            spyOn(HtmlControlBarController.internal, 'removeControlBar');

            HtmlControlBarController.closeControl();

            expect(HtmlControlBarController.props.toggle).toEqual(false);
            expect(HtmlControlBarController.props.htmlTag).toEqual('');
            expect(HtmlControlBarController.internal.removeControlBar).toHaveBeenCalled();
        });

    });

    describe('#toggleControl', function(){

        it('should toggle property', function(){
            HtmlControlBarController.toggleControl();

            expect(HtmlControlBarController.props.toggle).toEqual(true);
        });

    });

    describe('#addHTML', function(){

        it('should add html element', function(){
            HtmlControlBarController.props.htmlTag = 'div';
            HtmlControlBarController.internal.$target = $('<div></div>');
            spyOn(HtmlControlBarController.internal.$target, 'after');
            spyOn(HtmlControlBarController.internal, 'removeControlBar');

            HtmlControlBarController.addHTML();

            expect(HtmlControlBarController.props.toggle).toEqual(false);
            expect(HtmlControlBarController.internal.$target.after).toHaveBeenCalled();
            expect(HtmlControlBarController.props.htmlTag).toEqual('');
        });

    });

    describe('#removeHTML', function(){

        it('should remove html element', function(){
            HtmlControlBarController.internal.$target = $('<div></div>');
            spyOn(HtmlControlBarController.internal.$target, 'remove');
            spyOn(HtmlControlBarController.internal, 'removeControlBar');

            HtmlControlBarController.removeHTML();

            expect(HtmlControlBarController.props.toggle).toEqual(false);
            expect(HtmlControlBarController.props.htmlTag).toEqual('');
            expect(HtmlControlBarController.internal.$target.remove).toHaveBeenCalled();
        });

    });

    describe('#internal.addControlBar', function(){

        it('should add the html control bar', function(){
            HtmlControlBarController.internal.$elt = $('<div></div>');
            HtmlControlBarController.internal.$target = $('<div></div>');
            spyOn(HtmlControlBarController.internal.$elt, 'addClass');
            spyOn(HtmlControlBarController.internal.$elt, 'removeClass');
            spyOn(HtmlControlBarController.internal.$target, 'after');

            HtmlControlBarController.internal.addControlBar();

            expect(HtmlControlBarController.internal.$elt.addClass).toHaveBeenCalledWith('show');
            expect(HtmlControlBarController.internal.$elt.removeClass).toHaveBeenCalledWith('hide');
            expect(HtmlControlBarController.internal.$target.after).toHaveBeenCalled();
        });

    });

    describe('#internal.removeControlBar', function(){

        it('should remove the html control bar', function(){
            HtmlControlBarController.internal.$elt = $('<div></div>');
            spyOn(HtmlControlBarController.internal.$elt, 'removeClass');
            spyOn(HtmlControlBarController.internal.$elt, 'remove');

            HtmlControlBarController.internal.removeControlBar();

            expect(HtmlControlBarController.internal.$elt.removeClass.calls.count()).toEqual(2);
            expect(HtmlControlBarController.internal.$elt.remove).toHaveBeenCalled();
        });

    });

    describe('#internal.manageControlBar', function(){

        it('should manage the html control bar', function(){
            $scope.$apply = jasmine.createSpy();
            spyOn(HtmlControlBarController.internal, 'addControlBar');

            HtmlControlBarController.internal.manageControlBar({dom:'<div></div>', display:true});

            expect(HtmlControlBarController.internal.addControlBar).toHaveBeenCalled();
            expect($scope.$apply).toHaveBeenCalled();
        });

    });

    describe('#init', function(){

        it('should init the controller', function(){
            spyOn(NotificationService, 'subscribe');

            HtmlControlBarController.init();

            expect(NotificationService.subscribe.calls.count()).toEqual(2);
        });

        it('should call manageControlBar if HTML_CONTROL_BAR_ACTION notification is received', function(){
            spyOn(HtmlControlBarController.internal, 'manageControlBar');

            NotificationService.notify('HTML_CONTROL_BAR_ACTION', {test:'test'});

            expect(HtmlControlBarController.internal.manageControlBar).toHaveBeenCalledWith({test:'test'});
        });

        it('should set toggle property and call removeControlBar if USER_DATA notification is received', function(){
            spyOn(HtmlControlBarController.internal, 'removeControlBar');

            NotificationService.notify('USER_DATA', {data:{}});

            expect(HtmlControlBarController.props.toggle).toEqual(false);
            expect(HtmlControlBarController.internal.removeControlBar).toHaveBeenCalled();
        });

    });
    
    describe('#destroy', function(){

        it('should unsubscribe to HTML_CONTROL_BAR_ACTION and USER_DATA NotificationService', function(){
            spyOn(NotificationService, 'unsubscribe');

            $scope.$destroy();

            expect(NotificationService.unsubscribe.calls.count()).toEqual(2);
        });

    });

});