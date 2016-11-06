'use strict'

describe('PostContentController', function(){

    var PostContentController,
        NotificationService,
        PostHTTPService,
        UtilsService,
        $scope,
        $element,
        $state;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function($controller, $rootScope, _NotificationService_, _PostHTTPService_, _UtilsService_, _$state_){
            NotificationService = _NotificationService_;
            PostHTTPService = _PostHTTPService_;
            UtilsService = _UtilsService_;
            $state = _$state_;
            $scope = $rootScope.$new();
            $element = angular.element('<div></div>');

            PostContentController = $controller('PostContentController', {$scope:$scope, $element:$element});
        });
    });

    describe('#setArticleData', function(){

        it('should set the postData property and notify the ARTICLE_DATA notification', function(){
            spyOn(NotificationService, 'notify');

            PostContentController.setArticleData({});

            expect(PostContentController.internal.postData).toEqual({});
            expect(NotificationService.notify).toHaveBeenCalled();
        });

    });

    describe('#init', function(){

        it('should init the controller', function(){
            spyOn(NotificationService, 'subscribe');

            PostContentController.init();

            expect(NotificationService.subscribe.calls.count()).toEqual(2);
        });

        it('should update the article when SHORTCUT_SAVE notification is received', function(){
            PostContentController.internal.postData = { creator: { _id: '65454564514' }};
            spyOn(UtilsService, 'getIdFromJWT').and.returnValue('65454564514');
            spyOn(NotificationService, 'getLastNotifyValue').and.returnValue({firstname:'John', lastname:'Doe'});
            spyOn(PostHTTPService, 'updatePost');

            NotificationService.notify('SHORTCUT_SAVE', 'save');
            
            expect(PostHTTPService.updatePost).toHaveBeenCalled();
        });

        it('should redirect to home if user is disconnected and article is not active when USER_DATA notification is received', function(){
            PostContentController.internal.postData = { active:false };
            spyOn($state, 'go');

            NotificationService.notify('USER_DATA', {});
            
            expect($state.go).toHaveBeenCalledWith('home');
        });

    });

    describe('#destroy', function(){

        it('should unsubscribe to SHORTCUT_SAVE and USER_DATA NotificationService', function(){
            spyOn(NotificationService, 'unsubscribe');

            $scope.$destroy();

            expect(NotificationService.unsubscribe.calls.count()).toEqual(2);
        });

    });

});