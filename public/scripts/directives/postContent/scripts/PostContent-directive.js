'use strict'

angular
    .module('PostContentModule.directive')
    .directive('postContent', /*@ngInject*/function(PostHTTPService, UtilsService, NotificationService, $stateParams, $compile){

        return{
            restrict: 'E',
            scope: {},
            controller: 'PostContentController',
            controllerAs: 'post',
            link: function(scope, element, attrs, controller){
                var that = this,
                    url = $stateParams.category + '/' + $stateParams.article;
                PostHTTPService.getPostByURL(url, function(result){

                    if(UtilsService.keyInObject('data.content', result) && result.data.content){
                        var html = $compile(result.data.content)(scope);
                        controller.setArticleData(result.data);
                        element.append(html);

                        var htmlControlBar = $compile('<html-control-bar></html-control-bar>')(scope);
                        element.append(htmlControlBar);

                        var postControlBar = $compile('<post-control-bar></post-control-bar>')(scope);
                        element.append(postControlBar);

                    }
                });
            }
        };

    });