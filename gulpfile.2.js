var gulp = require('gulp');
var less = require('gulp-less');
var gulp_monify_css = require("1.");

gulp.task('testLess', function() {
    gulp.src(['src/less/**/*.less', '!src/less/{extend,page}/*.less'])
        .pipe(less())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('minicss', ['testLess'], function() {
    return gulp.src(['./dist/css/*.css'])
        .pipe(minifyCss())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('default', ['minicss'], function() {
    console.log('this is a demo');
});