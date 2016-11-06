'use strict'

describe('articleInfo-controller', function(){

    var ArticleInfoController,
        NotificationService,
        UtilsService,
        $scope;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function($controller, $rootScope, _NotificationService_, _UtilsService_){
            NotificationService = _NotificationService_;
            UtilsService = _UtilsService_;
            $scope = $rootScope.$new();

            ArticleInfoController = $controller('ArticleInfoController', {$scope:$scope});
        });
    });

    describe('#fillUserName', function(){

        it('should set the firstname and lastname property from last USER_DATA notified object', function(){
            NotificationService.notify('USER_DATA', {data:{firstname:'John', lastname:'Doe'}});
            NotificationService.notify('ARTICLE_DATA', {newArticle:true});

            ArticleInfoController.fillUserName();

            expect(ArticleInfoController.firstname).toEqual('John');
            expect(ArticleInfoController.lastname).toEqual('Doe');
        });

        it('should set the firstname and lastname property from last USER_DATA notified object', function(){
            NotificationService.notify('ARTICLE_DATA', {newArticle:false, creator:{firstname:'John', lastname:'Doe'}});

            ArticleInfoController.fillUserName();

            expect(ArticleInfoController.firstname).toEqual('John');
            expect(ArticleInfoController.lastname).toEqual('Doe');
        });

    });

    describe('#toggleActiveUser', function(){

        it('should activate the article user name', function(){
            NotificationService.notify('ARTICLE_DATA', {creator:{_id:'0123456789'}});
            spyOn(UtilsService, 'getIdFromJWT').and.callFake(function(){
                return '0123456789';
            });

            ArticleInfoController.toggleActiveUser();

            expect(ArticleInfoController.isActive).toEqual(true);
        });

        it('should deactivate the article user name', function(){
            NotificationService.notify('ARTICLE_DATA', {creator:{_id:'9876543210'}});
            spyOn(UtilsService, 'getIdFromJWT').and.callFake(function(){
                return '0123456789';
            });

            ArticleInfoController.toggleActiveUser();

            expect(ArticleInfoController.isActive).toEqual(false);
        });
    });

    describe('#init', function(){

        it('should call the toggleActiveUser method', function(){
            spyOn(ArticleInfoController, 'toggleActiveUser');

            ArticleInfoController.init();

            expect(ArticleInfoController.toggleActiveUser).toHaveBeenCalled();
        });

        it('should call the fillUserName method', function(){
            spyOn(ArticleInfoController, 'fillUserName');

            ArticleInfoController.init();

            expect(ArticleInfoController.fillUserName).toHaveBeenCalled();
        });

        it('should subscribe to USER_DATA && ARTICLE_DATA NotificationService', function(){
            spyOn(NotificationService, 'subscribe');

            ArticleInfoController.init();

            expect(NotificationService.subscribe.calls.count()).toEqual(2);
        });

        it('should call toggleActiveUser method if USER_DATA NotificationService has been received', function(){
            spyOn(ArticleInfoController, 'toggleActiveUser');

            NotificationService.notify('USER_DATA', {});

            expect(ArticleInfoController.toggleActiveUser).toHaveBeenCalled();
        });

        it('should call toggleActiveUser method if ARTICLE_DATA NotificationService has been received', function(){
            spyOn(ArticleInfoController, 'toggleActiveUser');

            NotificationService.notify('ARTICLE_DATA', {});

            expect(ArticleInfoController.toggleActiveUser).toHaveBeenCalled();
        });
    });

    describe('#destroy', function(){
        
        it('should unsubecribe to ARTICLE_DATA and USER_DATA NotificationService', function(){
            spyOn(NotificationService, 'unsubscribe');

            $scope.$destroy();

            expect(NotificationService.unsubscribe.calls.count()).toEqual(2);
        });

    });
});