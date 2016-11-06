'use strict'

var express = require('express'),
    Namespace = require('./interceptors/namespace'),
    LoggedData = require('./interceptors/logged-data'),
    Access = require('./interceptors/access'),
    Sanitizer = require('./interceptors/sanitizer'),

    getUsers = require('./end-points/users/get-users'),
    postUser = require('./end-points/users/post-user'),
    getUser = require('./end-points/users/get-user'),
    putUser = require('./end-points/users/put-user'),
    deleteUser = require('./end-points/users/delete-user'),

    getCategories = require('./end-points/categories/get-categories'),
    getCategory = require('./end-points/categories/get-category'),
    postCategory = require('./end-points/categories/post-category'),
    putCategory = require('./end-points/categories/put-category'),
    deleteCategory = require('./end-points/categories/delete-category'),

    getPosts = require('./end-points/posts/get-posts'),
    getPost = require('./end-points/posts/get-post'),
    getPostByURL = require('./end-points/posts/get-post-by-url'),
    getPostByUser = require('./end-points/posts/get-post-by-user'),
    getPostByCategory = require('./end-points/posts/get-post-by-category'),
    postPost = require('./end-points/posts/post-post'),
    putPost = require('./end-points/posts/put-post'),
    deletePost = require('./end-points/posts/delete-post'),

    router = express.Router();

router.route('/users')
    .get(Namespace.create, Access.xhrOnly, Access.loggedOnly().init, Access.adminOnly().init, getUsers().init)
    .post(Namespace.create, Access.xhrOnly, Sanitizer.clean, postUser().init);

router.route('/users/:user_id')
    .get(Namespace.create, Access.xhrOnly, Access.loggedOnly().init, Sanitizer.clean, getUser().init)
    .put(Namespace.create, Access.xhrOnly, Access.loggedOnly().init, Sanitizer.clean, putUser().init)
    .delete(Namespace.create, Access.xhrOnly, Access.loggedOnly().init, Access.adminOnly().init, Sanitizer.clean, deleteUser().init);

router.route('/posts')
    .get(Namespace.create, Access.xhrOnly, Access.loggedOnly().init, Access.adminOnly().init, getPosts().init)
    .post(Namespace.create, Access.xhrOnly, Access.loggedOnly().init, Sanitizer.clean, postPost().init);

router.route('/posts/:post_id')
    .get(Namespace.create, Access.xhrOnly, Access.loggedOnly().init, Sanitizer.clean, getPost().init)
    .put(Namespace.create, Access.xhrOnly, Access.loggedOnly().init, Sanitizer.clean, putPost().init)
    .delete(Namespace.create, Access.xhrOnly, Access.loggedOnly().init, Sanitizer.clean, deletePost().init);

router.route('/posts/article-url/*/*')
    .get(Namespace.create, Access.xhrOnly, LoggedData.parse().init, Sanitizer.clean, getPostByURL().init);
    
router.route('/posts/article-category-name/:category_name')
    .get(Namespace.create, Access.xhrOnly, LoggedData.parse().init, Sanitizer.clean, getPostByCategory().init);

router.route('/posts/article-user-id/:user_id')
    .get(Namespace.create, Access.xhrOnly, Access.loggedOnly().init, Sanitizer.clean, getPostByUser().init);

router.route('/categories')
    .get(Namespace.create, Access.xhrOnly, Access.loggedOnly().init, getCategories().init)
    .post(Namespace.create, Access.xhrOnly, Access.loggedOnly().init, Access.adminOnly().init, Sanitizer.clean, postCategory().init);

router.route('/categories/:category_id')
    .get(Namespace.create, Access.xhrOnly, Access.loggedOnly().init, Sanitizer.clean, getCategory().init)
    .put(Namespace.create, Access.xhrOnly, Access.loggedOnly().init, Access.adminOnly().init, Sanitizer.clean, putCategory().init)
    .delete(Namespace.create, Access.xhrOnly, Access.loggedOnly().init, Access.adminOnly().init, Sanitizer.clean, deleteCategory().init);

module.exports = router;