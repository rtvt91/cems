'use strict'

var express = require('express'),
    Namespace = require('./interceptors/namespace'),
    Access = require('./interceptors/access'),
    LoggedData = require('./interceptors/logged-data'),
    Sanitizer = require('./interceptors/sanitizer'),
    login = require('./end-points/actions/login'),
    logout = require('./end-points/actions/logout'),
    saveImage = require('./end-points/actions/save-image'),
    articleExists = require('./end-points/actions/article-exists'),
    FirstUser = require('./end-points/first-time/first-user'),
    defaultMongoData = require('./end-points/first-time/default-mongo-data'),
    router = express.Router();

router.route('/login')
    .post(Namespace.create, Access.xhrOnly, Sanitizer.clean, login().init);

router.route('/logout')
    .get(Namespace.create, Access.xhrOnly, Sanitizer.clean, logout);

router.route('/save-img')
    .post(Namespace.create, Access.xhrOnly, LoggedData.parse().init, Sanitizer.clean, saveImage().init);

router.route('/article-exists')
    .post(Namespace.create, Access.xhrOnly, Access.loggedOnly().init, Sanitizer.clean, articleExists().init);

router.route('/first-time')
    .post(Namespace.create, Access.xhrOnly, Sanitizer.clean, FirstUser().init, LoggedData.parse().init, defaultMongoData().init);
    
module.exports = router;