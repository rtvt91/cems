'use strict'

describe('UserListController', function(){

    var UserListController,
        UserHTTPService,
        UtilsService;
        
    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function($controller, _UserHTTPService_, _UtilsService_){
            UserHTTPService = _UserHTTPService_;
            UtilsService = _UtilsService_;

            UserListController = $controller('UserListController');
        });
    });

    describe('#internal.manageData', function(){

        it('should manage the data', function(){
            var result = {data:[
                {
                    _id: '0123456789',
                    firstname: 'John',
                    lastname: 'Doe',
                    email: 'john@doe.com',
                    role: 'ADMIN',
                    date: 'Fri Nov 04 2016 20:03:21 GMT+0100 (Paris, Madrid)',
                    active: true
                },
                {
                    _id: '9876543210',
                    firstname: 'Jane',
                    lastname: 'Parker',
                    email: 'jane@parker.com',
                    role: 'WRITER',
                    date: 'Fri Nov 04 2016 20:03:21 GMT+0100 (Paris, Madrid)',
                    active: true
                }
            ]};
            spyOn(UtilsService, 'getIdFromJWT').and.returnValue('0123456789');

            UserListController.internal.manageData(result);

            expect(UserListController.list.length).toEqual(1);
            expect(UserListController.list[0].compute.username).toEqual('Jane Parker');
            expect(UserListController.list[0].compute.date).toEqual(new Date('Fri Nov 04 2016 20:03:21 GMT+0100 (Paris, Madrid)'));
        });

    });

    describe('#internal.deleteUserCallback', function(){

        it('should call the init method', function(){
            spyOn(UserListController, 'init');

            UserListController.internal.deleteUserCallback();

            expect(UserListController.init).toHaveBeenCalled();
        });

    });

    describe('#internal.activeUserCallback', function(){

        it('should call the init method', function(){
            spyOn(UserListController, 'init');

            UserListController.internal.activeUserCallback();

            expect(UserListController.init).toHaveBeenCalled();
        });

    });

    describe('#internal.getUsersCallback', function(){

        it('should call the manageData method', function(){
            spyOn(UserListController.internal, 'manageData');

            UserListController.internal.getUsersCallback();

            expect(UserListController.internal.manageData).toHaveBeenCalled();
        });

    });

    describe('#deleteUser', function(){

        it('should call the UserHTTPService.deleteUser API', function(){
            spyOn(UserHTTPService, 'deleteUser');

            UserListController.deleteUser();

            expect(UserHTTPService.deleteUser).toHaveBeenCalled();
        });

    });

    describe('#activeUser', function(){

        it('should call the UserHTTPService.updateUser API', function(){
            spyOn(UserHTTPService, 'updateUser');

            UserListController.activeUser();

            expect(UserHTTPService.updateUser).toHaveBeenCalled();
        });

    });

    describe('#init', function(){

        it('should call the UserHTTPService.getUsers API', function(){
            spyOn(UserHTTPService, 'getUsers');

            UserListController.init();

            expect(UserHTTPService.getUsers).toHaveBeenCalled();
        });

    });

});