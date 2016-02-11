var gulp = require('gulp');
var server = require('gulp-server-livereload');

gulp.task('default', function(){
    gulp.src('./Beestore2.0_dev')
        .pipe(server({
            host: '172.27.185.144',
            livereload: true,
            directoryListing: false,
            open: true
    }));
});
