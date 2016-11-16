var gulp = require('gulp');
var packages = require('./../Index.js').getPackages();

gulp.task('watch', function watch() {
    'use strict';

    function watch (packageModel, artefact) {
        gulp.watch(packageModel.getBasePaths(artefact), ['compile:' + artefact + ':' + packageModel.options.name]);
    }

    // Loop over each package, and create a watcher for each task type.
    packages.forEach(function (packageModel) {
        var packageConfig = packageModel.options;

        if (packageConfig.sass) {
            watch(packageModel, 'sass');
        }

        if (packageConfig.scripts) {
            watch(packageModel, 'scripts');
        }

        if (packageConfig.inspector) {
            watch(packageModel, 'inspector');
        }
    });
});
