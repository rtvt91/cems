'use strict'

angular
    .module('app')
    .controller('CategoryController', /*@ngInject*/function(UtilsService, $stateParams){

        this.name = '';

        this.init = function(){
            var catName = UtilsService.keyInObject('name', $stateParams);
            if(catName === 'cat1'){
                this.name = 'Category 1';
            }else if(catName === 'cat2'){
                this.name = 'Category 2';
            }
        };

        this.init();

    });