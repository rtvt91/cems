'use strict'

describe('FirstTimeController', function(){

    var FirstTimeController,
        UserHTTPService,
        UtilsService;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function($controller, _UserHTTPService_, _UtilsService_){
            UserHTTPService = _UserHTTPService_;
            UtilsService = _UtilsService_;
            FirstTimeController = $controller('FirstTimeController');
        });
    });

    describe('#createUser', function(){
        
        it('should call UserHTTPService API', function(){
            spyOn(UserHTTPService, 'firstTime');

            FirstTimeController.createUser();

            expect(UserHTTPService.firstTime).toHaveBeenCalled();
        });

    });

});