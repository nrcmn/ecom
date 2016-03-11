'use strict';

var gulp = require('gulp');
var server = require('gulp-server-livereload');
var sass = require('gulp-sass');
var argv = require('yargs').argv;

var path = {
    project: [argv.serve],
    sass: [argv.serve + '/sass/**/*.scss'],
    css: argv.serve + '/css'
}

gulp.task('default', ['server', 'sass', 'watch']);

gulp.task('server', function(){
    gulp.src(path.project)
        .pipe(server({
            // host: "172.27.185.181",
            livereload: true,
            open: true
        }));
    });

gulp.task('sass', function(){
    gulp.src(path.sass)
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(path.css));
    });

gulp.task('watch', function(){
    gulp.watch(path.sass, ['sass']);
});
