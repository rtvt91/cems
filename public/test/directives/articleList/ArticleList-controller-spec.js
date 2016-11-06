'use strict'

describe('ArticleListController', function(){

    var ArticleListController,
        UtilsService,
        PostHTTPService,
        CategoryHTTPService,
        NotificationService,
        $sanitize,
        $state,
        $scope;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function($controller, $rootScope, _UtilsService_, _PostHTTPService_, _CategoryHTTPService_, _NotificationService_, _$sanitize_, _$state_){
            UtilsService = _UtilsService_;
            PostHTTPService = _PostHTTPService_;
            CategoryHTTPService = _CategoryHTTPService_;
            NotificationService = _NotificationService_;
            $sanitize = _$sanitize_;
            $state = _$state_;
            $scope = $rootScope.$new();

            ArticleListController = $controller('ArticleListController', {$scope:$scope});
        });

    });

    describe('#configureCheckboxFilter', function(){

        it('should configure the filters checkboxes and radios ', function(){

            var filter = ArticleListController.configureCheckboxFilter('active');
            expect(filter.active).toEqual('');

            ArticleListController.filter.active = 'activated';
            filter = ArticleListController.configureCheckboxFilter('active');
            expect(filter.active).toEqual(true);

            ArticleListController.filter.active = 'deactivated';
            filter = ArticleListController.configureCheckboxFilter('active');
            expect(filter.active).toEqual(false);

            filter = ArticleListController.configureCheckboxFilter('conflict');
            expect(filter.conflict).toEqual('');

            ArticleListController.filter.conflict = true;
            filter = ArticleListController.configureCheckboxFilter('conflict');
            expect(filter.conflict).toEqual(true);

        });

    });

    describe('#configureSelectFilter', function(){

        it('should configure the filter if select menu is set to "any" and the input text contains value :"hello"', function(){
            ArticleListController.filter.selectedFilter = '$';
            ArticleListController.filter.query = 'hello';

            var filter = ArticleListController.configureSelectFilter();

            expect(filter['$']).toEqual('hello');
        });

        it('should configure the filter if select menu is set to "title" and the input text contains value :"hello"', function(){
            ArticleListController.filter.selectedFilter = 'compute.h1';
            ArticleListController.filter.query = 'hello';

            var filter = ArticleListController.configureSelectFilter();

            expect(filter.compute.h1).toEqual('hello');
        });

        it('should configure the filter if select menu is set to "Subtitle" and the input text contains value :"hello"', function(){
            ArticleListController.filter.selectedFilter = 'compute.h2';
            ArticleListController.filter.query = 'hello';

            var filter = ArticleListController.configureSelectFilter();

            expect(filter.compute.h2).toEqual('hello');
        });

        it('should configure the filter if select menu is set to "Category" and the input text contains value :"hello"', function(){
            ArticleListController.filter.selectedFilter = 'categoryId.name';
            ArticleListController.filter.query = 'hello';

            var filter = ArticleListController.configureSelectFilter();

            expect(filter.categoryId.name).toEqual('hello');
        });

        it('should configure the filter if select menu is set to "Url" and the input text contains value :"hello"', function(){
            ArticleListController.filter.selectedFilter = 'compute.url';
            ArticleListController.filter.query = 'hello';

            var filter = ArticleListController.configureSelectFilter();

            expect(filter.compute.url).toEqual('hello');
        });

        it('should configure the filter if select menu is set to "User" and the input text contains value :"hello"', function(){
            ArticleListController.filter.selectedFilter = 'compute.username';
            ArticleListController.filter.query = 'hello';

            var filter = ArticleListController.configureSelectFilter();

            expect(filter.compute.username).toEqual('hello');
        });

    });

    describe('#cancelEdition', function(){

        it('should toggle the showTable property', function(){
            ArticleListController.toggle.table.showTable = false;

            ArticleListController.cancelEdition();

            expect(ArticleListController.toggle.table.showTable).toEqual(true);
        });

    });

    describe('#fillSelectedObject', function(){

        it('should fill the template with the selected article infos', function(){
            ArticleListController.currentIndex = 0;
            ArticleListController.categories = [{_id: '0123456789'}];
            ArticleListController.articles = [{
                h1:'hello',
                h2:'world',
                div:'Lorem Ipsum',
                categoryId:{
                    _id: '0123456789'
                }
            }];
            ArticleListController.selectedArticle = undefined;

            ArticleListController.fillSelectedObject();

            expect(ArticleListController.selectedCategory).toEqual({_id: '0123456789'});
            expect(ArticleListController.selectedArticle).toEqual(ArticleListController.articles[0]);

        });

    });

    describe('#editArticle', function(){

        it('should set the currentIndex, showTable property and call fillSelectedObject method', function(){
            ArticleListController.currentIndex = 10;
            ArticleListController.toggle.table.showTable = false;
            spyOn(ArticleListController, 'fillSelectedObject');

            ArticleListController.editArticle(2);

            expect(ArticleListController.currentIndex).toEqual(2);
            expect(ArticleListController.toggle.table.showTable).toEqual(true);
            expect(ArticleListController.fillSelectedObject).toHaveBeenCalled();

        });

    });

    describe('#toggleEditCat', function(){

        it('should set the open property', function(){
            ArticleListController.toggle.cat.open = false;

            ArticleListController.toggleEditCat();

            expect(ArticleListController.toggle.cat.open).toEqual(true);
        });

    });

    describe('#toggleEditUrl', function(){

        it('should set the open property', function(){
            ArticleListController.toggle.url.open = true;

            ArticleListController.toggleEditUrl();

            expect(ArticleListController.toggle.url.open).toEqual(false);
        });

    });

    describe('#changeCategory', function(){

        it('should update the post category', function(){
            ArticleListController.selectedCategory = {_id: '0123456789'};
            ArticleListController.selectedArticle = {categoryId: {_id: '9876543210'}};
            spyOn(PostHTTPService, 'updatePost');
            spyOn(ArticleListController, 'toggleEditCat');

            ArticleListController.changeCategory();

            expect(PostHTTPService.updatePost).toHaveBeenCalled();
            expect(ArticleListController.toggleEditCat).toHaveBeenCalled();
        });

    });

    describe('#changeUrl', function(){

        it('should close the change url panel if no new url is passed', function(){
            spyOn(ArticleListController, 'toggleEditUrl');

            ArticleListController.changeUrl();

            expect(ArticleListController.toggleEditUrl).toHaveBeenCalled();
        });

        it('should call PostHTTPService API if the new url is valid', function(){
            ArticleListController.selectedArticle = {_id:'54z5d45z4ds', categoryId: {_id: '9876543210'}};
            spyOn(PostHTTPService, 'updatePost');

            ArticleListController.changeUrl('hello-world');

            expect(PostHTTPService.updatePost).toHaveBeenCalled();
        });

    });

    describe('#deletePost', function(){

        it('should delete a post', function(){
            spyOn(PostHTTPService, 'deletePost');

            ArticleListController.deletePost();

            expect(PostHTTPService.deletePost).toHaveBeenCalled();
        });

    });

    describe('#activePost', function(){

        it('should activate a post', function(){
            spyOn(PostHTTPService, 'updatePost');

            ArticleListController.activePost();

            expect(PostHTTPService.updatePost).toHaveBeenCalled();
        });

    });

    describe('#gotoArticle', function(){

        it('should navigate to the selected post page', function(){
            ArticleListController.selectedArticle = {
                categoryId:{
                    name: 'cat1'
                },
                url: 'hello-world'
            };
            spyOn($state, 'go');

            ArticleListController.gotoArticle();

            expect($state.go).toHaveBeenCalledWith('article', {category:'cat1', article:'hello-world'});
        });

    });

    describe('#init', function(){

        it('should init the controller for ADMIN', function(){
            NotificationService.notify('USER_DATA', {data:{role:'ADMIN'}});
            spyOn(PostHTTPService, 'getPosts');

            ArticleListController.init();

            expect(PostHTTPService.getPosts).toHaveBeenCalled();
        });

        it('should init the controller for WRITER', function(){
            NotificationService.notify('USER_DATA', {data:{role:'WRITER'}});
            spyOn(PostHTTPService, 'getPostByUser');

            ArticleListController.init();

            expect(PostHTTPService.getPostByUser).toHaveBeenCalled();
        });

        it('should subscribe to CATEGORY_DELETED and CATEGORY_ADDED NotificationService', function(){
            spyOn(NotificationService, 'subscribe');

            ArticleListController.init();

            expect(NotificationService.subscribe.calls.count()).toEqual(2);
        });

    });

    describe('#destroy', function(){

        it('should unsubscribe to CATEGORY_DELETED and CATEGORY_ADDED NotificationService', function(){
            spyOn(NotificationService, 'unsubscribe');

            $scope.$destroy();

            expect(NotificationService.unsubscribe.calls.count()).toEqual(2);
        });
        
    });

});