var nbld = require('nbld');
var gulp = require('gulp');

nbld(gulp, {
    src: './src',
    dest: './build'
});

gulp.task('production', [ 'html:production' ]);
