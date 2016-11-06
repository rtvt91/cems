'use strict'

describe('PostHTTPService', function(){

    var PostHTTPService,
        $httpBackend,
        $state,
        postJson;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function(_PostHTTPService_, _$httpBackend_, _$state_){
            PostHTTPService = _PostHTTPService_;
            $httpBackend = _$httpBackend_;
            $state = _$state_;

            $httpBackend.expectGET('states/home.htm').respond(200, '');
            $httpBackend.flush();
        });
        postJson = readJSON('./test/datas/posts.json');

    });

    afterEach(function(){
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

    describe('POST API', function(){

        describe('#getPosts', function(){

            it('should retrieve all pots', function(){
                $httpBackend.expectGET('/api/posts').respond(postJson.getPosts);

                PostHTTPService.getPosts(function(result){
                    expect(result).toBeDefined();
                    expect(result.data.length).toEqual(2);
                    expect(result.data[0].url).toEqual('my-first-article');
                    expect(result.data[1].h1).toEqual('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
                });
                $httpBackend.flush();

            });

        });

        describe('#getPostByURL', function(){

            it('should retrieve a post by url', function(){
                $httpBackend.expectGET('/api/posts/article-url/cat1/my-first-article').respond(postJson.getPostByUrl);

                PostHTTPService.getPostByURL('cat1/my-first-article', function(result){
                    expect(result.data).toBeDefined();
                    expect(result.data.creator.firstname).toEqual('John');
                    expect(result.data.url).toEqual('my-first-article');
                });
                $httpBackend.flush();

            });

            it('should not call API if no url is passed', function(){
                var spy = jasmine.createSpy('spy');
                PostHTTPService.getPostByURL(undefined, spy);
                expect(spy).not.toHaveBeenCalled();
            });

        });

        describe('#getPostById', function(){

            it('should retrieve one post by id', function(){
                $httpBackend.expectGET('/api/posts/581715aea67e7712543da9db').respond(postJson.getPostById);
                
                PostHTTPService.getPostById({_id:'581715aea67e7712543da9db'}, function(result){
                    expect(result.data).toBeDefined();
                    expect(result.data.length).toEqual(1);
                    expect(result.data[0].userId.email).toEqual('admin@admin.com');
                    expect(result.data[0].conflict).toEqual(false);
                });
                $httpBackend.flush();

            });

            it('should not call API if no id is passed', function(){
                var spy = jasmine.createSpy('spy');
                PostHTTPService.getPostById(undefined, spy);
                expect(spy).not.toHaveBeenCalled();
            });

        });

        describe('#getPostByCategory', function(){

            it('should retrieve one post by category name', function(){
                $httpBackend.expectGET('/api/posts/article-category-name/cat1').respond(postJson.getPostByCategory);
                
                PostHTTPService.getPostByCategory({category_name:'cat1'}, function(result){
                    expect(result.data).toBeDefined();
                    expect(result.data.length).toEqual(1);
                    expect(result.data[0].categoryId.name).toEqual('cat1');
                    expect(result.data[0].div).toBeDefined();
                });
                $httpBackend.flush();

            });

            it('should not call API if no category name is passed', function(){
                var spy = jasmine.createSpy('spy');
                PostHTTPService.getPostByCategory(undefined, spy);
                expect(spy).not.toHaveBeenCalled();
            });

        });

        describe('#getPostByUser', function(){

            it('should retrieve one post by user id', function(){
                var user_id = "581715aea67e7712543da9d9";
                $httpBackend.expectGET('/api/posts/article-user-id/' + user_id).respond(postJson.getPostByUser);
                
                PostHTTPService.getPostByUser(user_id, function(result){
                    expect(result.data).toBeDefined();
                    expect(result.data.length).toEqual(1);
                    expect(result.data[0].userId.email).toEqual('admin@admin.com');
                });
                $httpBackend.flush();

            });

            it('should not call API if no user id is passed', function(){
                var spy = jasmine.createSpy('spy');
                PostHTTPService.getPostByUser(undefined, spy);
                expect(spy).not.toHaveBeenCalled();
            });

        });

        describe('#postPost', function(){

            it('should post a new article', function(){

                var newPost = {
                    "url": "my-new-article",
                    "active": true,
                    "userId": "5819c3dba600b91fa465969d",
                    "content": "<div><p>Hello World</p></div>"
                };

                $httpBackend.expectPOST('/api/posts/', newPost).respond(postJson.postPost);
                PostHTTPService.postPost(newPost, function(result){
                    expect(result).toBeDefined();
                    expect(result.msgType).toEqual('post-post');
                    expect(result.token).toBeUndefined();
                });
                $httpBackend.flush();

            });

            it('should not call API if no object is passed', function(){
                var spy = jasmine.createSpy('spy');
                PostHTTPService.getPostByCategory(undefined, spy);
                expect(spy).not.toHaveBeenCalled();
            });

        });

        describe('#updatePost', function(){
            
            it('should update a post', function(){
                var updatedData = {_id:'5819c3dba600b91fa46596a1', url:'my-modify-url'};
                $httpBackend.expectPUT('/api/posts/5819c3dba600b91fa46596a1', updatedData).respond(postJson.putPost);
                PostHTTPService.updatePost(updatedData, function(result){
                    expect(result.msgType).toEqual('put-post');
                    expect(result.token).toBeUndefined();
                });
                $httpBackend.flush();

            });

            it('should not call API if no obj is passed', function(){
                var spy = jasmine.createSpy('spy');
                PostHTTPService.updatePost(undefined, spy);
                expect(spy).not.toHaveBeenCalled();
            });
        });

        describe('#deletePost', function(){

            it('should delete a post', function(){

                $httpBackend.expectDELETE('/api/posts/5819965296eee52a5831b01b').respond(postJson.deletePost);

                PostHTTPService.deletePost('5819965296eee52a5831b01b', function(result){
                    expect(result.msgType).toEqual('delete-post');
                    expect(result.token).toBeUndefined();
                });
                $httpBackend.flush();

            });

            it('should not call API if no id is passed', function(){
                var spy = jasmine.createSpy('spy');
                PostHTTPService.deletePost(undefined, spy);
                expect(spy).not.toHaveBeenCalled();
            });

        });

        describe('#saveImg', function(){

            it('should save an image', function(){

                var imgData = {
                    description:"egypt",
                    imgData:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA1wAAAEVCAYAAAD0LeRJ",
                    postId:"5819c3dba600b91fa46596a1",
                    previousImgSrc:"img/post/default/default.jpg",
                    title:"my img"
                };
                $httpBackend.expectPOST('/action/save-img', imgData).respond(postJson.postImg);

                PostHTTPService.saveImg(imgData, function(result){
                    expect(result.msgType).toEqual('save-img');
                    expect(result.url).toEqual("img/post/temp/5819c3dba600b91fa465969d_my-img.png");
                    expect(result.token).toBeUndefined();
                });
                $httpBackend.flush();

            });

            it('should not call API if no object is passed', function(){
                var spy = jasmine.createSpy('spy');
                PostHTTPService.saveImg(undefined, spy);
                expect(spy).not.toHaveBeenCalled();
            });

        });

        describe('error case', function(){

            it('should redirect to 401 page', function(){

                spyOn($state, 'go');
                $httpBackend.expectGET('/api/posts').respond(401);

                PostHTTPService.getPosts(function(){});
                $httpBackend.flush();

                expect($state.go).toHaveBeenCalledWith('401');
            });

            it('should redirect to 404 page', function(){

                spyOn($state, 'go');
                $httpBackend.expectGET('/api/posts').respond(404);

                PostHTTPService.getPosts(function(){});
                $httpBackend.flush();

                expect($state.go).toHaveBeenCalledWith('404');

            });
        });

    });

});