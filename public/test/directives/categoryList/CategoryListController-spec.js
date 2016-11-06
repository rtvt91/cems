'use strict'

describe('CategoryListController', function(){

    var CategoryListController,
        CategoryHTTPService,
        UtilsService,
        NotificationService;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function($controller, _CategoryHTTPService_, _UtilsService_, _NotificationService_){
            CategoryHTTPService = _CategoryHTTPService_;
            UtilsService = _UtilsService_;
            NotificationService = _NotificationService_;

            CategoryListController = $controller('CategoryListController');
        });
    });

    describe('#internal.manageData', function(){

        it('should set list property', function(){
            CategoryListController.list = undefined;

            CategoryListController.internal.manageData({
                data:[{
                    id:'21212458784',
                    name:'cat1'
                }]
            });

            expect(CategoryListController.list).toBeDefined();
        });

    });

    describe('#isValid', function(){

        it('should check if the url is valid', function(){
            CategoryListController.catName = 'my-url';

            var test = CategoryListController.isValid();

            expect(test).toEqual(true);
        });

    });

    describe('#addCategory', function(){

        it('should add a new category', function(){
            CategoryListController.catName = 'my-url';
            spyOn(CategoryHTTPService, 'postCategory');
            spyOn(NotificationService, 'notify');

            CategoryListController.addCategory();

            expect(CategoryListController.catName).toEqual('');
            expect(CategoryHTTPService.postCategory).toHaveBeenCalled();
            expect(NotificationService.notify).toHaveBeenCalledWith('CATEGORY_ADDED');
        });

    });

    describe('#activeCategory', function(){

        it('should active/deactive category', function(){
            spyOn(CategoryHTTPService, 'updateCategory');

            CategoryListController.activeCategory('6455644zdzd', true);

            expect(CategoryHTTPService.updateCategory).toHaveBeenCalled();
        });

    });
    
    describe('#deleteCategory', function(){

        it('should active/deactive category', function(){
            spyOn(CategoryHTTPService, 'deleteCategory');

            CategoryListController.deleteCategory('6455644zdzd');

            expect(CategoryHTTPService.deleteCategory).toHaveBeenCalled();
        });

    });

    describe('#init', function(){

        it('should init the controller', function(){
            spyOn(CategoryHTTPService, 'getCategory');

            CategoryListController.init();

            expect(CategoryHTTPService.getCategory).toHaveBeenCalled();
        });

    });

});