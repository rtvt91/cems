'use strict'

var path = require('path'),
    fs = require('fs'),
    gulp = require('gulp'),
    mongoose = require('mongoose'),
    clean = require('gulp-clean'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    nodemon = require('nodemon'),
    jsFilesOrder = require('./public/jsFilesOrder'),
    cssFilesOrder = require('./public/cssFilesOrder');

//----------------------------------------------------------------------------------------

gulp.task('dropDatabase', function(done){
    var options = { /*user: 'root', pass: 'root'*/};
    mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/cems', options);
    mongoose.connection.on('open', function(){
        mongoose.connection.db.dropDatabase(function(err){
            mongoose.connection.close(function () {
                done();
            });
        });
    });
});

gulp.task('rewriteFirstTime', function(done){
    var ftPath = path.join(__dirname, './private/config/first-time.json'),
        firstTime = JSON.parse(fs.readFileSync(ftPath, 'utf8'));
    firstTime.start = true;
	fs.writeFileSync(ftPath, JSON.stringify(firstTime, null, 2));
    done();
});

gulp.task('deleteImgFolders', function(){
    var stream = gulp.src(['./public/img/post/media/', './public/img/post/temp/'], {read: false})
        .pipe(clean({force: true}));
    return stream;
});

//----------------------------------------------------------------------------------------

gulp.task('simple-reload', function(done){
    browserSync.reload();
    done();
});

gulp.task('watch-less', ['less'], function(done){
    browserSync.reload();
    done();
});

gulp.task('watch-scripts', ['scripts'], function(done){
    browserSync.reload();
    done();
});

gulp.task('nodemonTask', function(done){
    var started = false;
    return nodemon({
        script: './private/server.js',
        ext: 'js',
        ignore: [
            './bower_components',
            './node_modules',
            './public',
            './*.json',
            './*.js'
        ]
    }).on('start', function(){
        // to avoid nodemon being started multiple times
        if(!started){
            done();
            started = true;
        }
    }).on('restart', function () {
        setTimeout(function () {
            browserSync.reload({ stream: false });
        }, 1000);
    });
});

gulp.task('browser-sync', ['nodemonTask'], function(){
    browserSync.init(null, {
        proxy: '127.0.0.1:5555',
        //port: 7000,
        logFileChanges: false,
        online: false
    });

    gulp.watch('./public/**/*.html', ['simple-reload']);
    gulp.watch('./public/**/*.htm', ['simple-reload']);
    gulp.watch('./public/less/**/*.less', ['watch-less']);
    gulp.watch('./public/scripts/**/*.js', ['watch-scripts']);
    gulp.watch('./public/jsFilesOrder.js', ['watch-scripts']);
});

gulp.task('less', function(cssStream){
    var stream = gulp.src('./public/less/**/*.less')
        .pipe(less({}))
        .pipe(concat('styles.css'))
        .pipe(minifyCSS({keepBreaks:true}))
        .pipe(gulp.dest('./public/build/css'));
    return stream;
});

gulp.task('css', function(){
    var stream = gulp.src(cssFilesOrder)
        .pipe(concat('vendors.css'))
        .pipe(minifyCSS({keepBreaks:true}))
        .pipe(gulp.dest('./public/build/css'));
    return stream;
});

gulp.task('scripts', function(){
    var stream = gulp.src(jsFilesOrder)
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(gulp.dest('./public/build/scripts/'));
    return stream;
});

gulp.task('copyFonts', function(){
    var stream = gulp.src('./bower_components/bootstrap/fonts/*.{ttf,woff,eof,svg,woff2}')
        .pipe(gulp.dest('./public/build/fonts'));
    return stream;
});

gulp.task('deleteBuildFolder', function(){
    var stream = gulp.src('./public/build')
        .pipe(clean({force: true}));
    return stream;
});


gulp.task('default', ['browser-sync', 'copyFonts', 'scripts', 'css', 'less']);
gulp.task('reset', ['deleteBuildFolder', 'deleteImgFolders', 'rewriteFirstTime', 'dropDatabase']);