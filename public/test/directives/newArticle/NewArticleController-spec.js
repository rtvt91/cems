'use strict'

describe('NewArticleController', function(){

    var NewArticleController,
        CategoryHTTPService,
        UtilsService,
        PostHTTPService,
        $location,
        $state;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function($controller, _CategoryHTTPService_, _UtilsService_, _PostHTTPService_, _$location_, _$state_){
            CategoryHTTPService = _CategoryHTTPService_;
            UtilsService = _UtilsService_;
            PostHTTPService = _PostHTTPService_;
            $location = _$location_;
            $state = _$state_;

            NewArticleController = $controller('NewArticleController');
        });
    });

    describe('#internal.articleExistsCallback', function(){

        it('should check if an article exists', function(){
            NewArticleController.defaultSelection = {name: 'cat1'};
            NewArticleController.url = 'my-new-post';
            spyOn($state, 'go');

            NewArticleController.internal.articleExistsCallback({exists: false});

            expect($state.go).toHaveBeenCalledWith('article', {category:NewArticleController.defaultSelection.name, article:NewArticleController.url});
        });

    });

    describe('#internal.getCategoryCallback', function(){

        it('should set categories and defaultSelection properties', function(){

            NewArticleController.internal.getCategoryCallback({data: [{name:'default', _id:'21546796d4', active: true}]});

            expect(NewArticleController.categories.length).toEqual(1);
            expect(NewArticleController.defaultSelection).toEqual({name:'default', _id:'21546796d4', active: true});
        });

    });

    describe('#createNewPost', function(){

        it('should create a new article', function(){
            NewArticleController.defaultSelection = {name: 'cat1'};
            NewArticleController.url = 'my-new-post';
            spyOn(PostHTTPService, 'articleExists');

            NewArticleController.createNewPost();

            expect(PostHTTPService.articleExists).toHaveBeenCalled();
        });

    });

    describe('#init', function(){

        it('should init the controller', function(){
            spyOn(CategoryHTTPService, 'getCategory');

            NewArticleController.init();

            expect(NewArticleController.rootUrl).toEqual('http://server/80');
        });

    });

});