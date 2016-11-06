'use strict'

var modules = [
    'ui.router',
    'ngSanitize',
    'ngAnimate',
    'LocalStorageModule',
    'BannerModule',
    'FirstTimeModule',
    'LoginModule',
    'KeyshortcutModule',
    'PopupModule',
    'NewArticleModule',
    'ArticlesByCategoryModule',
    'ArticleInfoModule',
    'PostContentModule',
    'PostControlBarModule',
    'EditableContentModule',
    'HtmlControlBarModule',
    'EditableImgModule',
    'SliderModule',
    'ImgEditorModule',
    'UserInfoModule',
    'ArticleListModule',
    'CategoryListModule',
    'UserListModule'
];

angular
    .module('app', modules)
    .config(/*@ngInject*/function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'states/home.htm'
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: function ($stateParams){
                    return 'states/dashboard?date=' + new Date().getTime();
                },
                redirectTo: 'dashboard.user-info'
            })
            .state('dashboard.user-info', {
                url: '/user-info',
                templateUrl: 'states/dashboard.user-info.htm'
            })
            .state('dashboard.article-list', {
                url: '/article-list',
                templateUrl: 'states/dashboard.article-list.htm'
            })
            .state('dashboard.category-list', {
                url: '/category-list',
                templateUrl: 'states/dashboard.category-list.htm'
            })
            .state('dashboard.user-list', {
                url: '/user-list',
                templateUrl: 'states/dashboard.user-list.htm'
            })
            .state('category', {
                url: '/category/:name',
                templateUrl: 'states/category.htm',
                controller: 'CategoryController',
                controllerAs: 'categoryCtrl'
            })
            .state('article', {
                url: '/:category/:article',
                templateUrl: 'states/article.htm'
            })
            .state('401', {
                url: '/401',
                templateUrl: 'states/401.htm'
            })
            .state('404', {
                url: '/404',
                templateUrl: 'states/404.htm'
            });
        
        $urlRouterProvider.otherwise('404');

        // Rewrite headers for XHR calls in order to node understand them
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
        //Send systematically the existing JWT token for every requests
        $httpProvider.interceptors.push('HTTPInterceptor');

        //Activate HTML5 mode if exists
        if(window.history && window.history.pushState){
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: true //look for tag html <base>
            });
        }

    })
    .run(/*@ngInject*/function($rootScope, $state){
        //Handle 401 or 404 error from template request
        $rootScope.$on('401', function(){
            $state.go('401');
        });
        $rootScope.$on('404', function(){
            $state.go('404');
        });
        //Handle dashboard redirection to nested state dashboard.user-info
        $rootScope.$on('$stateChangeStart', function(evt, to, params) {
            if(to.redirectTo){
                evt.preventDefault();
                $state.go(to.redirectTo, params, {location: 'dashboard.user-info'})
            }
        });
    });