'use strict'

describe('UserHTTPService', function(){

    var UserHTTPService,
        $httpBackend,
        NotificationService,
        $state,
        userJson;

    beforeEach(function(){

        angular.mock.module('app');
        angular.mock.inject(function(_UserHTTPService_, _$httpBackend_, _NotificationService_, _$state_){
            UserHTTPService = _UserHTTPService_;
            $httpBackend = _$httpBackend_;
            NotificationService = _NotificationService_;
            $state = _$state_;

            $httpBackend.expectGET('states/home.htm').respond(200, '');
            $httpBackend.flush();
        });
        userJson = readJSON('./test/datas/users.json');

    });

    afterEach(function(){
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

    describe('USER API', function(){

        describe('#getUsers', function(){

            it('should retrieve all users', function(){
                $httpBackend.expectGET('/api/users').respond(userJson.getUsers);

                UserHTTPService.getUsers(function(result){
                    expect(result.data).toBeDefined();
                    expect(result.data[0].email).toEqual('admin@admin.com');
                    expect(result.token).toBeUndefined();
                });
                $httpBackend.flush();

            });

        });

        describe('#getUserById', function(){

            it('should retrieve one user by id', function(){
                $httpBackend.expectGET('/api/users/581715aea67e7712543da9d7').respond(userJson.getUser);
                
                UserHTTPService.getUserById({_id:'581715aea67e7712543da9d7'}, function(result){
                    expect(result.data).toBeDefined();
                    expect(result.data.email).toEqual('admin@admin.com');
                    expect(result.token).toBeUndefined();
                });
                $httpBackend.flush();

            });

            it('should not call API if no id is passed', function(){
                var spy = jasmine.createSpy('spy');
                UserHTTPService.getUserById(undefined, spy);
                expect(spy).not.toHaveBeenCalled();
            });

        });

        describe('#postUser', function(){

            it('should post a new user', function(){

                var newUser = userJson.postUser.data;

                NotificationService.subscribe('USER_DATA', function(result){
                    expect(result.data).toBeDefined();
                    expect(result.data.email).toEqual('user@user.com');
                    expect(result.token).toBeUndefined();
                    expect(result.msgType).toEqual('post-user');
                });

                $httpBackend.expectPOST('/api/users/', newUser).respond(userJson.postUser);
                UserHTTPService.postUser(newUser);
                $httpBackend.flush();

            });

            it('should not call API if no object is passed', function(){
                spyOn(NotificationService, 'notify');
                UserHTTPService.postUser();
                expect(NotificationService.notify).not.toHaveBeenCalled();
            });

        });

        describe('#updateUser', function(){
            
            it('should update a user', function(){

                var updatedData = {_id:'5819965296eee52a5831b01b', firstname: 'Jane'};
                $httpBackend.expectPUT('/api/users/5819965296eee52a5831b01b', updatedData).respond(userJson.putUser);
                UserHTTPService.updateUser(updatedData, function(result){
                    expect(result.data).toBeDefined();
                    expect(result.data[0].firstname).toEqual('Jane');
                    expect(result.msgType).toEqual('put-user');
                    expect(result.token).toBeUndefined();
                });
                $httpBackend.flush();

            });

            it('should not call API if no id is passed', function(){
                var spy = jasmine.createSpy('spy');
                UserHTTPService.updateUser(undefined, spy);
                expect(spy).not.toHaveBeenCalled();
            });
        });

        describe('#deleteUser', function(){

            it('should delete a user', function(){

                $httpBackend.expectDELETE('/api/users/5819965296eee52a5831b01b').respond(userJson.deleteUser);

                UserHTTPService.deleteUser('5819965296eee52a5831b01b', function(result){
                    expect(result.data).toBeUndefined();
                    expect(result.msgType).toEqual('delete-user');
                    expect(result.token).toBeUndefined();
                });
                $httpBackend.flush();

            });

        });

        describe('#login', function(){

            it('should log in a user', function(){

                var user = {email:'admin@admin.com', password:'P@ssw0rd'};
                $httpBackend.expectPOST('/action/login', user).respond(userJson.login);

                NotificationService.subscribe('USER_DATA', function(result){
                    expect(result).toBeDefined();
                    expect(result.data.email).toEqual('admin@admin.com');
                    expect(result.msgType).toEqual('login');
                });

                UserHTTPService.login(user);
                $httpBackend.flush();

            });

            it('should not call API if no object is passed', function(){

                spyOn(NotificationService, 'notify');
                UserHTTPService.login(null);
                expect(NotificationService.notify).not.toHaveBeenCalled();

            });

        });

        describe('#logout', function(){

            it('should logout a user', function(){

                $httpBackend.expectGET('/action/logout').respond(userJson.logout);

                NotificationService.subscribe('USER_DATA', function(result){
                    expect(result).toBeDefined();
                    expect(result.msgType).toEqual('logout');
                });
                UserHTTPService.logout();
                $httpBackend.flush();

            });

        });

        describe('#first-time', function(){

            it('should save the first user', function(){

                var newUser = userJson.postUser.data;
                $httpBackend.expectPOST('/action/first-time/', newUser).respond(userJson.getUser);

                UserHTTPService.firstTime(newUser, function(result){
                    expect(result).toBeDefined();
                    expect(result.data.email).toEqual('admin@admin.com');
                    expect(result.data.role).toEqual('ADMIN');
                });
                $httpBackend.flush();

            });

        });

        describe('error case', function(){

            it('should redirect to 401 page', function(){

                spyOn($state, 'go');
                $httpBackend.expectGET('/api/users').respond(401);

                UserHTTPService.getUsers(function(){});
                $httpBackend.flush();

                expect($state.go).toHaveBeenCalledWith('401');
            });

            it('should redirect to 404 page', function(){

                spyOn($state, 'go');
                $httpBackend.expectGET('/api/users').respond(404);

                UserHTTPService.getUsers(function(){});
                $httpBackend.flush();

                expect($state.go).toHaveBeenCalledWith('404');

            });
        });

    });

});