'use strict'

describe('CanvasService', function(){

    var CanvasService,
        $img,
        data;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function(_CanvasService_){
            CanvasService = _CanvasService_;
        });

        $img = $('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAwFBMVEXm7NK41k3w8fDv7+q01Tyy0zqv0DeqyjOszDWnxjClxC6iwCu11z6y1DvA2WbY4rCAmSXO3JZDTxOiwC3q7tyryzTs7uSqyi6tzTCmxSukwi9aaxkWGga+3FLv8Ozh6MTT36MrMwywyVBziSC01TbT5ZW9z3Xi6Mq2y2Xu8Oioxy7f572qxzvI33Tb6KvR35ilwTmvykiwzzvV36/G2IPw8O++02+btyepyDKvzzifvSmw0TmtzTbw8PAAAADx8fEC59dUAAAA50lEQVQYV13RaXPCIBAG4FiVqlhyX5o23vfVqUq6mvD//1XZJY5T9xPzzLuwgKXKslQvZSG+6UXgCnFePtBE7e/ivXP/nRvUUl7UqNclvO3rpLqofPDAD8xiu2pOntjamqRy/RqZxs81oeVzwpCwfyA8A+8mLKFku9XfI0YnSKXnSYZ7ahSII+AwrqoMmEFKriAeVrqGM4O4Z+ADZIhjg3R6LtMpWuW0ERs5zunKVHdnnnMLNQqaUS0kyKkjE1aE98b8y9x9JYHH8aZXFMKO6JFMEvhucj3Wj0kY2D92HlHbE/9Vk77mD6srRZqmVEAZAAAAAElFTkSuQmCC"/>');

        data = {
            canvas: $('<canvas width="860" height="277"/>'),
            height:277,
            previousImgSrc:"img/post/default/default.jpg",
            src: undefined,
            width:860
        };
    });

    describe('#internal.buildStage', function(){

        it('should create a new stage on canvas element', function(){

            CanvasService.internal.data = data;
            CanvasService.internal.buildStage();

            expect(CanvasService.internal.canvasData.stage).toBeDefined();
            expect(CanvasService.internal.canvasData.stage._bounds.width).toEqual(860);
            expect(CanvasService.internal.canvasData.stage._bounds.height).toEqual(277);
        });

    });

    describe('#internal.buildBackground', function(){

        it('should create a new background and add it to the stage', function(){
            CanvasService.internal.data = data;
            CanvasService.internal.buildStage();
            spyOn(CanvasService.internal.canvasData.stage, 'addChild');
            spyOn(CanvasService.internal.canvasData.stage, 'update');

            CanvasService.internal.buildBackground();

            expect(CanvasService.internal.canvasData.shape).toBeDefined();
            expect(CanvasService.internal.canvasData.stage.addChild).toHaveBeenCalledWith(CanvasService.internal.canvasData.shape);
            expect(CanvasService.internal.canvasData.stage.update).toHaveBeenCalled();
        });

    });

    describe('#all tests that require the bitmap loading end (bitmap manipulation)', function(){
        beforeEach(function(done) {
            $img.on('load', function(evt){
                data.src = evt.target;
                done();
            });
        });

        describe('#internal.buildBmp', function(){

            it('should create a new bitmap and add it to the stage', function(done){
                CanvasService.internal.data = data;
                CanvasService.internal.buildStage();
                
                CanvasService.internal.buildBmp();

                expect(CanvasService.internal.canvasData.bitmap).toBeDefined();
                expect(CanvasService.internal.canvasData.bitmap.regX).toEqual(10);
                expect(CanvasService.internal.canvasData.bitmap.regY).toEqual(10);
                expect(CanvasService.internal.canvasData.bitmap.x).toEqual(430);
                expect(CanvasService.internal.canvasData.bitmap.y).toEqual(138.5);
                done();
            });

        });

        describe('#internal.manageFilters', function(){

            it('should apply the different filters on the bitmap', function(done){
                CanvasService.internal.data = data;
                CanvasService.internal.cloneBitmapData = angular.extend({}, CanvasService.internal.originalBitmapData);
                CanvasService.internal.buildStage();
                CanvasService.internal.buildBmp();
                spyOn(CanvasService.internal.canvasData.bitmap, 'updateCache');
                spyOn(CanvasService.internal.canvasData.stage, 'update');

                CanvasService.internal.manageFilters();

                expect(CanvasService.internal.canvasData.bitmap.filters).toEqual([]);
                expect(CanvasService.internal.canvasData.bitmap.updateCache).toHaveBeenCalled();
                expect(CanvasService.internal.canvasData.stage.update).toHaveBeenCalled();
                done();
            });

        });

        describe('#internal.manageBCHS', function(){

            it('should apply the effects on the bitmap', function(done){
                CanvasService.internal.data = data;
                CanvasService.internal.cloneBitmapData = angular.extend({}, CanvasService.internal.originalBitmapData);
                CanvasService.internal.buildStage();
                CanvasService.internal.buildBmp();
                CanvasService.internal.buildNewColorMatrix();
                spyOn(CanvasService.internal.matrix, 'adjustHue');
                spyOn(CanvasService.internal.matrix, 'adjustSaturation');
                spyOn(CanvasService.internal.matrix, 'adjustContrast');
                spyOn(CanvasService.internal.matrix, 'adjustBrightness');

                CanvasService.internal.manageBCHS();

                expect(CanvasService.internal.matrix.adjustHue).toHaveBeenCalled();
                expect(CanvasService.internal.matrix.adjustSaturation).toHaveBeenCalled();
                expect(CanvasService.internal.matrix.adjustContrast).toHaveBeenCalled();
                expect(CanvasService.internal.matrix.adjustBrightness).toHaveBeenCalled();
                expect(CanvasService.internal.cloneBitmapData.colorMatrixFilter).toBeDefined();
                done();
            });

        });

        describe('#setBCHS', function(){

            it('should set the bright, constrast, hue or saturation on the bitmap', function(){
                CanvasService.internal.data = data;
                CanvasService.internal.cloneBitmapData = angular.extend({}, CanvasService.internal.originalBitmapData);
                CanvasService.internal.buildStage();
                CanvasService.internal.buildBmp();

                spyOn(CanvasService.internal, 'buildNewColorMatrix');
                spyOn(CanvasService.internal, 'manageBCHS');
                spyOn(CanvasService.internal, 'manageFilters');

                CanvasService.setBCHS({name:'HUE', ratio:0.5});

                expect(CanvasService.internal.cloneBitmapData.hue).toEqual(0.5);
                expect(CanvasService.internal.buildNewColorMatrix).toHaveBeenCalled();
                expect(CanvasService.internal.manageBCHS).toHaveBeenCalled();
                expect(CanvasService.internal.manageFilters).toHaveBeenCalled();
            });

        });

        describe('#setRGBA', function(){

            it('should set the red, green, blue or alpha on the bitmap', function(){
                CanvasService.internal.data = data;
                CanvasService.internal.cloneBitmapData = angular.extend({}, CanvasService.internal.originalBitmapData);
                CanvasService.internal.buildStage();
                CanvasService.internal.buildBmp();

                spyOn(CanvasService.internal, 'manageFilters');

                CanvasService.setRGBA({name:'RED', ratio:0.5});

                expect(CanvasService.internal.cloneBitmapData.red).toEqual(0.5);
                expect(CanvasService.internal.cloneBitmapData.colorFilter.redMultiplier).toEqual(0.5);
                expect(CanvasService.internal.manageFilters).toHaveBeenCalled();
            });

        });

        describe('#rotateBmp', function(){

            it('should set the rotation on the bitmap', function(){
                CanvasService.internal.data = data;
                CanvasService.internal.cloneBitmapData = angular.extend({}, CanvasService.internal.originalBitmapData);
                CanvasService.internal.buildStage();
                CanvasService.internal.buildBmp();

                spyOn(CanvasService.internal.canvasData.stage, 'update');

                CanvasService.rotateBmp(0.1);

                expect(CanvasService.internal.cloneBitmapData.rotation).toEqual(0.1);
                expect(CanvasService.internal.canvasData.bitmap.rotation).toEqual(0.1);
                expect(CanvasService.internal.canvasData.stage.update).toHaveBeenCalled();
            });

        });

        describe('#resizeBmp', function(){

            it('should set the rotation on the bitmap', function(){
                CanvasService.internal.data = data;
                CanvasService.internal.cloneBitmapData = angular.extend({}, CanvasService.internal.originalBitmapData);
                CanvasService.internal.buildStage();
                CanvasService.internal.buildBmp();

                spyOn(CanvasService.internal.canvasData.stage, 'update');

                CanvasService.resizeBmp(0.7);

                expect(CanvasService.internal.cloneBitmapData.scaleX).toEqual(0.7);
                expect(CanvasService.internal.cloneBitmapData.scaleY).toEqual(0.7);
                expect(CanvasService.internal.canvasData.bitmap.scaleX).toEqual(0.7);
                expect(CanvasService.internal.canvasData.bitmap.scaleY).toEqual(0.7);
                expect(CanvasService.internal.canvasData.stage.update).toHaveBeenCalled();
            });

        });

        describe('#destroy', function(){

            it('should reset the internal.cloneBitmapData and internal.canvasData', function(){
                CanvasService.destroy();

                expect(CanvasService.internal.cloneBitmapData).toEqual(CanvasService.internal.originalBitmapData);
                expect(CanvasService.internal.canvasData).toEqual({});
            });

        });

        describe('#build', function(){

            it('should build the service', function(){
                spyOn(CanvasService.internal, 'buildStage');
                spyOn(CanvasService.internal, 'buildBackground');
                spyOn(CanvasService.internal, 'buildBmp');

                CanvasService.build(data);

                expect(CanvasService.internal.data).toEqual(data);
                expect(CanvasService.internal.cloneBitmapData).toEqual(CanvasService.internal.originalBitmapData);
                expect(CanvasService.internal.buildStage).toHaveBeenCalled();
                expect(CanvasService.internal.buildBackground).toHaveBeenCalled();
                expect(CanvasService.internal.buildBmp).toHaveBeenCalled();
            });

        });

    });
});