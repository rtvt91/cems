'use strict'

angular
    .module('app')
    .service('CanvasService', /*@ngInject*/function(UtilsService){
        
        var that = this;

        this.internal = {
            data: {},
            canvasData: {},
            cloneBitmapData: {},
            mouseData: {},
            matrix: undefined,
            originalBitmapData: {
                rotation: 1,
                scaleX:1,
                scaleY:1,
                red: 1,
                green: 1,
                blue: 1,
                alpha: 1,
                bright: 1,
                contrast: 1,
                saturation: 1,
                hue: 1,
                colorFilter: undefined,
                colorMatrixFilter: undefined
            },
            buildStage: function(){
                if(UtilsService.keyInObject('canvas', this.data)){
                    this.canvasData.stage = new createjs.Stage(this.data.canvas.get(0));
                    this.canvasData.stage.setBounds(0, 0, this.data.width, this.data.height);
                }
            },
            buildBackground: function(){
                if(UtilsService.keyInObject('canvas', this.data) && UtilsService.keyInObject('stage', this.canvasData)){
                    this.canvasData.shape = new createjs.Shape();
                    this.canvasData.shape.graphics.beginFill("#000000").drawRect(0, 0, this.data.width, this.data.height);
                    this.canvasData.stage.addChild(this.canvasData.shape);
                    this.canvasData.stage.update();
                }
            },
            buildBmp: function(){
                if(UtilsService.keyInObject('src', this.data) && UtilsService.keyInObject('stage', this.canvasData)){

                    this.canvasData.bitmap = new createjs.Bitmap(this.data.src);

                    this.canvasData.bitmap.cache(0, 0, this.canvasData.bitmap.image.width, this.canvasData.bitmap.image.height);
                    this.canvasData.bitmap.regX = this.canvasData.bitmap.image.width * 0.5;
                    this.canvasData.bitmap.regY = this.canvasData.bitmap.image.height * 0.5;
                    this.canvasData.bitmap.x = this.canvasData.stage.canvas.width * 0.5;
                    this.canvasData.bitmap.y = this.canvasData.stage.canvas.height * 0.5;

                    this.canvasData.bitmap.addEventListener('mousedown', function(evt){
                        that.internal.mouseData.offSetX = that.internal.canvasData.stage.mouseX - that.internal.canvasData.bitmap.x;
                        that.internal.mouseData.offSetY = that.internal.canvasData.stage.mouseY - that.internal.canvasData.bitmap.y;
                    });

                    this.canvasData.bitmap.addEventListener('pressmove', function(){
                        that.internal.canvasData.bitmap.x = that.internal.canvasData.stage.mouseX - that.internal.mouseData.offSetX;
                        that.internal.canvasData.bitmap.y = that.internal.canvasData.stage.mouseY - that.internal.mouseData.offSetY;
                        that.internal.canvasData.stage.update();
                    });

                    this.canvasData.stage.addChild(this.canvasData.bitmap);
                    this.canvasData.stage.update();
                }   
            },
            manageFilters: function(){
                var list = [];
                if(UtilsService.keyInObject('colorFilter', this.cloneBitmapData)){
                    list.push(this.cloneBitmapData.colorFilter);
                }
                if(UtilsService.keyInObject('colorMatrixFilter', this.cloneBitmapData)){
                    list.push(this.cloneBitmapData.colorMatrixFilter);
                }
                this.canvasData.bitmap.filters = list;
                this.canvasData.bitmap.updateCache();
                this.canvasData.stage.update();
            },
            buildNewColorMatrix: function(){
                this.matrix = new createjs.ColorMatrix();
            },
            manageBCHS: function(){
                this.matrix.adjustHue(this.cloneBitmapData.hue);
                this.matrix.adjustSaturation(this.cloneBitmapData.saturation);
                this.matrix.adjustContrast(this.cloneBitmapData.contrast);
                this.matrix.adjustBrightness(this.cloneBitmapData.bright);
                this.cloneBitmapData.colorMatrixFilter = new createjs.ColorMatrixFilter(this.matrix);
            }
        };

        this.setBCHS = function(param){
            this.internal.cloneBitmapData[param.name.toLowerCase()] = param.ratio;
            this.internal.buildNewColorMatrix();
            this.internal.manageBCHS();
            this.internal.manageFilters();
        };

        this.setRGBA = function(param){
            this.internal.cloneBitmapData[param.name.toLowerCase()] = param.ratio;
            this.internal.cloneBitmapData.colorFilter = new createjs.ColorFilter(this.internal.cloneBitmapData.red, this.internal.cloneBitmapData.green, this.internal.cloneBitmapData.blue, this.internal.cloneBitmapData.alpha);
            this.internal.manageFilters();
        };

        this.rotateBmp = function(ratio){
            if(UtilsService.keyInObject('bitmap', this.internal.canvasData)){
                this.internal.cloneBitmapData.rotation = ratio;
                this.internal.canvasData.bitmap.rotation = this.internal.cloneBitmapData.rotation;
                this.internal.canvasData.stage.update();
            }
        };

        this.resizeBmp = function(ratio){
            if(UtilsService.keyInObject('bitmap', this.internal.canvasData)){
                this.internal.cloneBitmapData.scaleX = ratio;
                this.internal.cloneBitmapData.scaleY = ratio;
                this.internal.canvasData.bitmap.scaleX = this.internal.cloneBitmapData.scaleX;
                this.internal.canvasData.bitmap.scaleY = this.internal.cloneBitmapData.scaleY;
                this.internal.canvasData.stage.update();
            }
        };

        this.destroy = function(){
            this.internal.cloneBitmapData = angular.extend({}, this.internal.originalBitmapData);
            this.internal.canvasData = {};
        };
        
        this.build = function(param){
            if(angular.isDefined(param) && !UtilsService.isEmptyObject(param)){
                this.internal.data = angular.extend(this.internal.data, param);
                this.internal.cloneBitmapData = angular.extend({}, this.internal.originalBitmapData);
                this.internal.buildStage();
                this.internal.buildBackground();
                this.internal.buildBmp();
            }
        };
    });