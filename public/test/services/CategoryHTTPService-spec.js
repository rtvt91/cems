'use strict'

describe('CategoryHTTPService', function(){

    var CategoryHTTPService,
        $httpBackend,
        $state,
        categoryJson;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function(_CategoryHTTPService_, _$httpBackend_, _$state_){
            CategoryHTTPService = _CategoryHTTPService_;
            $httpBackend = _$httpBackend_;
            $state =_$state_;

            $httpBackend.expectGET('states/home.htm').respond(200, '');
            $httpBackend.flush();
        });
        categoryJson = readJSON('./test/datas/categories.json');
    });

    afterEach(function(){
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

    describe('CATEGORY API', function(){

        describe('#getCategory', function(){
            
            it('should retrieve all categories', function(){

                $httpBackend.expectGET('/api/categories').respond(categoryJson.getCategories);
                CategoryHTTPService.getCategory(function(result){
                    expect(result).toBeDefined();
                    expect(result.data.length).toEqual(3);
                    expect(result.data[1]._id).toEqual('5819c3dba600b91fa465969f');
                    expect(result.token).toBeUndefined();
                });
                $httpBackend.flush();

            });

        });

        describe('#postCategory', function(){
            
            it('should post a new category', function(){
                $httpBackend.expectPOST('/api/categories/', {name:'cat3'}).respond(categoryJson.postCategory);
                CategoryHTTPService.postCategory({name:'cat3'}, function(result){
                    expect(result).toBeDefined();
                    expect(result.data.name).toEqual('cat3');
                    expect(result.data.active).toEqual(true);
                    expect(result.msgType).toEqual('post-category');
                    expect(result.token).toBeUndefined();
                });
                $httpBackend.flush();

            });

            it('should not call API if no object is passed', function(){
                var spy = jasmine.createSpy('spy');
                CategoryHTTPService.postCategory(undefined, spy);
                expect(spy).not.toHaveBeenCalled();
            });

        });

        describe('#updateCategory', function(){
            
            it('should update a category', function(){
                $httpBackend.expectPUT('/api/categories/5819c3dba600b91fa465969f', {_id:'5819c3dba600b91fa465969f', name:'my-new-cat'}).respond(categoryJson.putCategory);
                CategoryHTTPService.updateCategory({_id:'5819c3dba600b91fa465969f', name:'my-new-cat'}, function(result){
                    expect(result).toBeDefined();
                    expect(result.data.name).toEqual('my-new-cat');
                    expect(result.msgType).toEqual('put-category');
                    expect(result.token).toBeUndefined();
                });
                $httpBackend.flush();

            });

            it('should not call API if no obj is passed', function(){
                var spy = jasmine.createSpy('spy');
                CategoryHTTPService.updateCategory(undefined, spy);
                expect(spy).not.toHaveBeenCalled();
            });

        });

        describe('#deleteCategory', function(){
            
            it('should delete a category', function(){
                $httpBackend.expectDELETE('/api/categories/5819c3dba600b91fa465969f').respond(categoryJson.deleteCategory);
                CategoryHTTPService.deleteCategory('5819c3dba600b91fa465969f', function(result){
                    expect(result).toBeDefined();
                    expect(result.msgType).toEqual('delete-category');
                    expect(result.token).toBeUndefined();
                });
                $httpBackend.flush();

            });

            it('should not call API if no obj is passed', function(){
                var spy = jasmine.createSpy('spy');
                CategoryHTTPService.deleteCategory(undefined, spy);
                expect(spy).not.toHaveBeenCalled();
            });

        });

        describe('error case', function(){

            it('should redirect to 401 page', function(){

                spyOn($state, 'go');
                $httpBackend.expectGET('/api/categories').respond(401);

                CategoryHTTPService.getCategory(function(){});
                $httpBackend.flush();

                expect($state.go).toHaveBeenCalledWith('401');
            });

            it('should redirect to 404 page', function(){

                spyOn($state, 'go');
                $httpBackend.expectGET('/api/categories').respond(404);

                CategoryHTTPService.getCategory(function(){});
                $httpBackend.flush();

                expect($state.go).toHaveBeenCalledWith('404');

            });
        });

    });

});