'use strict'

describe('HTTPInterceptor', function(){

    var HTTPInterceptor,
        localStorageService,
        NotificationService,
        $rootScope,
        jwt;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function(_HTTPInterceptor_, _localStorageService_, _NotificationService_, _$rootScope_){
            HTTPInterceptor = _HTTPInterceptor_;
            localStorageService = _localStorageService_;
            NotificationService = _NotificationService_;
            $rootScope = _$rootScope_;
        });
        jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU2MmJiZGIxYTI2MWFiMGMxMGUyNzgxYSJ9.mVs1A6aPsQ3aVOvrXU9xvPdo4frGzAzJVN_ka36g_5k';
    });

    describe('#request method', function(){

        it('should fill the header Authorization key if a jwt is found in localstorage', function(){
            spyOn(localStorageService, 'get').and.callFake(function(){
                return jwt;
            });

            var request = HTTPInterceptor.request({});
            expect(request.headers.Authorization).toEqual('Bearer ' + jwt);
        });

        it('should not create an Authorization key if there\'s no jwt in localstorage', function(){
            spyOn(localStorageService, 'get').and.callFake(function(){
                return;
            });

            var request = HTTPInterceptor.request({});
            expect(request.headers.Authorization).toBe(undefined);
        });

    });

    describe('#response', function(){

        it('should set JWT to localstorage and notify message via NotificationService', function(){
            spyOn(localStorageService, 'set').and.callFake(function(){
                return;
            });
            spyOn(NotificationService, 'notify').and.callFake(function(){
                return;
            });
            var response = HTTPInterceptor.response({
                status: 200,
                data:{
                    token: jwt,
                    msgType: 'login',
                    msg: 'logged in',
                    data: [{firstname:'John', lastname:'Doe'}]
                }
            });
            
            expect(response.data.data.token).toEqual(undefined);
            expect(response.data.data.msg).toEqual(undefined);
            expect(response.data.data.errorMsg).toEqual(undefined);

            expect(localStorageService.set).toHaveBeenCalled();
            expect(NotificationService.notify).toHaveBeenCalledWith('MESSAGE', {msg: 'logged in', msgType:'login'});
            expect(response.data.data.length).toEqual(1);
            expect(response.data.data[0].firstname).toEqual('John');
            expect(response.data.data[0].lastname).toEqual('Doe');
        });

        it('should not parse the response if the response status is not 200', function(){
            spyOn(localStorageService, 'set');
            var response = HTTPInterceptor.response({
                status: 401,
                data:{}
            });

            expect(localStorageService.set).not.toHaveBeenCalled();
        });

        it('should not parse the response if there\'s no data in the response', function(){
            spyOn(localStorageService, 'set');
            var response = HTTPInterceptor.response({
                status: 200
            });

            expect(localStorageService.set).not.toHaveBeenCalled();
        });

        it('should clear the localstorage and JWT if no token was sent', function(){
            spyOn(localStorageService, 'clearAll');
            spyOn(NotificationService, 'notify');

            var response = HTTPInterceptor.response({
                status: 200,
                data:{
                    msg: 'logged in',
                    msgType: 'login',
                    data: [{firstname:'John', lastname:'Doe'}]
                }
            });

            expect(localStorageService.clearAll).toHaveBeenCalled();
            expect(NotificationService.notify).toHaveBeenCalledWith('MESSAGE', {msg: 'logged in', msgType:'login'});
        });

    });

    describe('#responseError', function(){

        it('should clear the localstorage and notify an empty USER_DATA object when a 401 error is received', function(){
            spyOn(localStorageService, 'clearAll');
            spyOn(NotificationService, 'notify');
            spyOn($rootScope, '$emit');

            var response = HTTPInterceptor.responseError({
                status: 401,
                data:{}
            });

            expect(localStorageService.clearAll).toHaveBeenCalled();
            expect(NotificationService.notify).toHaveBeenCalledWith('USER_DATA', {});
            expect($rootScope.$emit).toHaveBeenCalledWith('401');
        });


        it('should $emit a 404 event when a 404 error is received', function(){
            spyOn($rootScope, '$emit');

            var response = HTTPInterceptor.responseError({
                status: 404,
                data:{}
            });

            expect($rootScope.$emit).toHaveBeenCalledWith('404');
        });

    });

});
