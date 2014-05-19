/**
 * Delete specified directories and all files in them.
 *
 * ---------------------------------------------------------------
 *
 */

var clean = require('gulp-clean');
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');
var paths = require('../paths');

module.exports = function (gulp) {

  gulp.task('watch', function () {
    gulp.watch(paths.css, ['sass']);
    gulp.watch(paths.scripts, ['copyScriptsToAssets']);
    gulp.watch(paths.images, ['images']);
    gulp.watch(paths.jsxTemplates, ['react']);
  });

};