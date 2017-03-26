var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

// gulp.task('jsmin', function() {
//     gulp.src('src/js/index.js')
//         .pipe(uglify())
//         .pipe(gulp.dest('dist/js'));
// });

gulp.task('default', function() {
    gulp.src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest('dist/build'));
});