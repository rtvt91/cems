'use strict'

describe('FileReaderFactory', function(){

    var FileReaderFactory,
        NotificationService;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function(_FileReaderFactory_, _NotificationService_){
            FileReaderFactory = _FileReaderFactory_;
            NotificationService = _NotificationService_;
        });
    });

    describe('#build', function(){

        it('should load an image', function(){

            var blob = new Blob([""], { type: 'image.*' });
            blob["lastModifiedDate"] = "";
            blob["name"] = "filename";

            var file = FileReaderFactory.build(blob);

            expect(file).toBeDefined();
        });

        it('should not load anything but image', function(){

            var blob = new Blob([""], { type: 'text/html' });
            blob["lastModifiedDate"] = "";
            blob["name"] = "filename";

            var file = FileReaderFactory.build(blob);

            expect(file).toBeUndefined();
        });

    });

    describe('#destroy', function(){

        it('should destroy the filereader', function(){

            var blob = new Blob([""], { type: 'image.*' });
            blob["lastModifiedDate"] = "";
            blob["name"] = "filename";

            var file = FileReaderFactory.build(blob);
                file = FileReaderFactory.destroy();

            expect(file).toBeUndefined();
        });

    });

    describe('#events', function(){

        var fn;
        beforeEach(function(done) {
            fn = {
                callback: function(){ done(); }
            };
            spyOn(fn, 'callback').and.callThrough();
            var id = NotificationService.subscribe('FILE_READER', fn.callback);

            var blob = new Blob([""], { type: 'image.*' });
            blob["lastModifiedDate"] = "";
            blob["name"] = "filename";   
            var file = FileReaderFactory.build(blob);
        });

        it('should test event', function(done){
            expect(fn.callback).toHaveBeenCalled();
            done();
        });

    });

});