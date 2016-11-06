'use strict'

angular
    .module('ArticleListModule.controller')
    .controller('ArticleListController', /*@ngInject*/function(UtilsService, PostHTTPService, CategoryHTTPService, NotificationService, $sanitize, $state, $scope){

        var that = this,
            categoryDeletedNotifId,
            categoryAddedNotifId;
            
        this.articles = [];
        this.categories = [];
        this.user = {},
        this.toggle = {
            cat:{
                open: false
            },
            url:{
                open: false
            },
            table:{
                showTable: true
            }
        };
        this.currentIndex;
        this.selectedArticle = {};
        this.selectedCategory = {};

        this.filter = {
            selectedFilter: '$',
            query: '',
            active: '',
            conflict: ''
        };

        this.configureCheckboxFilter = function(str){
            if(str && UtilsService.keyInObject(str, this.filter, true)){
                var filter = {};
                if(str === 'active'){
                    if(this.filter.active === ''){
                        filter[str] = '';
                    }else if(this.filter.active === 'activated'){
                        filter[str] = true;
                    }else if(this.filter.active === 'deactivated'){
                        filter[str] = false;
                    }
                }else if(str === 'conflict'){
                    filter[str] = (this.filter[str])? true : '';
                }
                return filter;
            }
        };

        this.configureSelectFilter = function() {
            var filter = UtilsService.buildObjectFromString(this.filter.selectedFilter, this.filter.query);
            return filter;
        };

        var manageData = function(param){
            if(UtilsService.keyInObject('posts.data', param) && param.posts.data.length > 0){
                var posts = param.posts.data;
                angular.forEach(posts, function(obj, id){
                    obj.compute = {
                        h1: $sanitize(obj.h1),
                        h2: $sanitize(obj.h2),
                        date: new Date(obj.date),
                        url: (obj.categoryId)? (obj.categoryId.name + '/' + obj.url) : '',
                        username: (obj.userId)? (obj.userId.firstname + ' ' + obj.userId.lastname) : 'DELETED USER'
                    };
                });
            }
            that.categories = UtilsService.keyInObject('categories.data', param);
            that.articles = posts || [];
            that.fillSelectedObject();
        };

        this.cancelEdition = function(){
            this.toggle.table.showTable = !this.toggle.table.showTable;
        };

        this.fillSelectedObject = function(){
            if(UtilsService.keyInObject('currentIndex', this, true)){
                this.selectedArticle = this.articles[this.currentIndex];
                angular.forEach(this.categories, function(obj, id){
                    if(that.selectedArticle.categoryId._id === obj._id){
                        that.selectedCategory = obj;
                    }
                });
            }
        };

        this.editArticle = function(index){
            this.currentIndex = index;
            this.fillSelectedObject(index);
            this.toggle.table.showTable = !this.toggle.table.showTable;
        };

        this.toggleEditCat = function(){
            this.toggle.cat.open = !this.toggle.cat.open;
        };

        this.toggleEditUrl = function(){
            this.toggle.url.open = !this.toggle.url.open;
        };

        this.changeCategory = function(){
            if(UtilsService.keyInObject('_id', this.selectedCategory) !== UtilsService.keyInObject('categoryId._id', this.selectedArticle)){
                PostHTTPService.updatePost({_id:this.selectedArticle._id, categoryId:this.selectedCategory._id}, function(result){
                    that.init();
                });
            }
            that.toggleEditCat();
        };

        this.changeUrl = function(newUrl){
            if(!newUrl){
                that.toggleEditUrl();
            }else if(UtilsService.isValidUrl(newUrl) && this.selectedArticle){
                PostHTTPService.updatePost({_id:this.selectedArticle._id, url:newUrl}, function(result){
                    that.selectedArticle.compute.url = that.selectedArticle.categoryId.name + '/' + newUrl;
                    that.toggleEditUrl();
                    that.init();
                });
            }
        };

        this.deletePost = function(id){
            PostHTTPService.deletePost(id, function(result){
                that.init();
                that.toggle.table.showTable = !that.toggle.table.showTable;
                that.currentIndex = undefined;
            });
        };

        this.activePost = function(id, bool){
            PostHTTPService.updatePost({_id:id, active:!bool}, function(result){
                that.init();
            });
        };

        this.gotoArticle = function(){
            var category = UtilsService.keyInObject('categoryId.name', this.selectedArticle),
                article = UtilsService.keyInObject('url', this.selectedArticle);
            if(category && article){
                $state.go('article', {category: category, article: article});
            }
        };

        this.init = function(){
            var obj = {},
                user = NotificationService.getLastNotifyValue('USER_DATA');
            this.user.role = UtilsService.keyInObject('data.role', user);
            if(this.user.role === 'ADMIN'){
                PostHTTPService.getPosts(function(result){
                    obj.posts = result;
                    CategoryHTTPService.getCategory(function(result){
                        obj.categories = result;
                        manageData(obj);
                    });
                });
            }else{
                PostHTTPService.getPostByUser(UtilsService.getIdFromJWT(), function(result){
                    obj.posts = result;
                    CategoryHTTPService.getCategory(function(result){
                        obj.categories = result;
                        manageData(obj);
                    });
                });
            }

            categoryDeletedNotifId = NotificationService.subscribe('CATEGORY_DELETED', function(result){
                that.init();
            });
            categoryAddedNotifId = NotificationService.subscribe('CATEGORY_ADDED', function(result){
                that.init();
            });
        };

        this.init();

        $scope.$on('$destroy', function(){
            NotificationService.unsubscribe('CATEGORY_DELETED', categoryDeletedNotifId);
            NotificationService.unsubscribe('CATEGORY_ADDED', categoryAddedNotifId);
        });

    });