'use strict'

module.exports = (function(){
    var vendors = [
        './bower_components/angular/angular.js',
        './bower_components/angular-sanitize/angular-sanitize.js',
        './bower_components/angular-ui-router/release/angular-ui-router.js',
        './bower_components/angular-local-storage/dist/angular-local-storage.js',
        './bower_components/angular-animate/angular-animate.js',
        './bower_components/jquery/dist/jquery.js',
        './bower_components/bootstrap/dist/js/bootstrap.js',
        './bower_components/medium-editor/dist/js/medium-editor.js',
        './bower_components/medium-editor/dist/js/medium-editor.js',
        './bower_components/EaselJS/lib/easeljs-0.8.2.min.js'
    ];

    var apps = [
        './public/scripts/app.js'
    ];

    var controllers = [
        './public/scripts/controllers/**/*.js'
    ];

    var factories = [
        './public/scripts/factories/**/*.js'
    ];

    var services = [
        './public/scripts/services/**/*.js'
    ];

    var directives = [
        './public/scripts/directives/**/*.js'
    ];
    return [].concat(vendors, apps, factories, services, controllers, directives);
}());