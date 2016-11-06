'use strict'

var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    path = require('path'),
    Namespace = require('./interceptors/namespace'),
    Access = require('./interceptors/access'),
    Sanitizer = require('./interceptors/sanitizer'),
    Utils = require('./../utils/utils'),
    Post = require('./../mongo-models/post'),
    CONST = require('./../config/constant');

router.route('/dashboard')
    .get(Namespace.create, Access.xhrOnly, Access.loggedOnly().init, function(req, res){

        var template = (Utils.keyInObject('CEMS.jwt.role', req) === CONST.USER.ROLE.ADMIN)? './html/dashboard-admin.htm': './html/dashboard.htm',
            url = path.join(__dirname, template),
            html = fs.readFileSync(url);
        res.send(html);
    });

module.exports = router;