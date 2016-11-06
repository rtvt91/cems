'use strict'

describe('CategoryController', function(){

    var $controller,
        CategoryController,
        UtilsService,
        $stateParams;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function(_$controller_, _UtilsService_, _$stateParams_){
            $controller = _$controller_;
            UtilsService = _UtilsService_;
            $stateParams = _$stateParams_;

            CategoryController = $controller('CategoryController');
        });
    });

    describe('#init', function(){

        it('should set the name property from the $stateParams object category name', function(){
            spyOn(UtilsService, 'keyInObject').and.returnValue('cat1');

            CategoryController.init();

            expect(CategoryController.name).toEqual('Category 1');
        });

    });

});