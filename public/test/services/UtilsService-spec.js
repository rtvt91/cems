'use strict'

describe('UtilsService', function(){

    var UtilsService,
        localStorageService;

    beforeEach(function(){

        angular.mock.module('app');
        angular.mock.inject(function(_UtilsService_, _localStorageService_){
            UtilsService = _UtilsService_;
            localStorageService = _localStorageService_;
        });

    });

    describe('#validEmail', function(){

        it('should check if a string is a valid email', function(){
            expect(UtilsService.validEmail('admin@admin.com')).toBe(true);
            expect(UtilsService.validEmail('hello@world')).toBe(false);
            expect(UtilsService.validEmail(undefined)).toBe(false);
            expect(UtilsService.validEmail('')).toBe(false);
        });

    });

    describe('#validPassword', function(){

        it('should check if a string is a valid password', function(){
            expect(UtilsService.validPassword('P@ssw0rd')).toBe(true);
            expect(UtilsService.validPassword('password')).toBe(false);
        });

    });

    describe('#isValidUrl', function(){

        it('should check if a string is a valid url', function(){
            expect(UtilsService.isValidUrl('this-is-a-valid-url')).toBe(true);
            expect(UtilsService.isValidUrl('invalid url')).toBe(false);
        });

    });

    describe('#inArray', function(){

        it('should check if a string is in array', function(){
            expect(UtilsService.inArray('test', ['hello', 'test', 'world'])).toBe(true);
            expect(UtilsService.inArray('hi', ['hello', 'test', 'world'])).toBe(false);
        });

    });

    describe('#scaleRange', function(){

        it('should return convert a value from a range to its equivaklent in a another range', function(){
            expect(UtilsService.scaleRange(50, 0, 100, 0, 10)).toEqual(5);
            expect(UtilsService.scaleRange(50, 0, 100, 0, 2)).toEqual(1);
            expect(UtilsService.scaleRange(25, 0, 100, 0, 10)).not.toEqual(30);
        });

    });

    describe('#getIdFromJWT', function(){

        it('should return the id of logged in user', function(){
            spyOn(localStorageService, 'get').and.callFake(function(){
                return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU2MmJiZGIxYTI2MWFiMGMxMGUyNzgxYSJ9.mVs1A6aPsQ3aVOvrXU9xvPdo4frGzAzJVN_ka36g_5k';
            });
            var id = UtilsService.getIdFromJWT();
            expect(id).toEqual('562bbdb1a261ab0c10e2781a');
        });

        it('should return undefined if the jwt is not valid', function(){
            spyOn(localStorageService, 'get').and.callFake(function(){
                return 'zdzdz.dzdzd.dzdz';
            });
            var id = UtilsService.getIdFromJWT();
            expect(id).toEqual(undefined);
        });

        it('should return undefined if the jwt does not exist', function(){
            spyOn(localStorageService, 'get').and.callFake(function(){
                return;
            });
            var id = UtilsService.getIdFromJWT();
            expect(id).toEqual(undefined);
        });

    });

    describe('#isEmptyObject', function(){

        it('should check if an object is empty', function(){
            expect(UtilsService.isEmptyObject({})).toBe(true);
            expect(UtilsService.isEmptyObject({msg:'hello'})).toBe(false);
        });

    });

    describe('#keyInObject', function(){

        it('should retrieve value from a key in object, if it exists' , function(){
            var obj = {
                member:{
                    person:{
                        firstname:'John',
                        lastname:'Doe'
                    }
                }
            };
            expect(UtilsService.keyInObject('member.person.lastname', obj)).toBe('Doe');
            expect(UtilsService.keyInObject('member.person', obj)).toEqual({firstname:'John',lastname:'Doe'});
            expect(UtilsService.keyInObject('member.person.lastname', {})).toBe(undefined);
        });

    });

    describe('#buildObjectFromString', function(){

        it('should return an object from a string', function(){
            var obj = UtilsService.buildObjectFromString('i.am.a.object.tree', 'test');
            expect(UtilsService.keyInObject('i.am.a.object.tree', obj)).toEqual('test');
            var obj2 = UtilsService.buildObjectFromString('another.tree-object', 'hello world');
            expect(UtilsService.keyInObject('another.tree-object', obj2)).toEqual('hello world');
        });

    });
});