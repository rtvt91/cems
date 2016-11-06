'use strict'

angular
    .module('CategoryListModule.controller')
    .controller('CategoryListController', /*@ngInject*/function(CategoryHTTPService, UtilsService, NotificationService){

        var that = this;
        
        this.list = [];
        this.catName = '';
        this.internal = {
            manageData: function(result){
                that.list = result.data || [];
            }
        };

        this.isValid = function(){
            return UtilsService.isValidUrl(this.catName);
        };

        this.addCategory = function(){
            if(UtilsService.isValidUrl(this.catName)){
                CategoryHTTPService.postCategory({name: this.catName}, function(result){
                    that.init();
                });
                this.catName = '';
                NotificationService.notify('CATEGORY_ADDED');
            }
        };

        this.activeCategory = function(id, bool){
            CategoryHTTPService.updateCategory({_id:id, active:!bool}, function(result){
                that.init();
            });
        };

        this.deleteCategory = function(id, bool){
            CategoryHTTPService.deleteCategory(id, function(result){
                NotificationService.notify('CATEGORY_DELETED');
                that.init();
            });
        };

        this.init = function(){
            CategoryHTTPService.getCategory(function(result){
                that.internal.manageData(result);
            });
        };

        this.init();

    });