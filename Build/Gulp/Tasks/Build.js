var gulp = require('gulp');

gulp.task('build', ['compile:modernizr', 'compile:scripts', 'compile:inspector', 'compile:sass']);
