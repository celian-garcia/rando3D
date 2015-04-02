var gulp = require('gulp');
var buildMode = require('../config').buildMode;

if (buildMode.watch) {
    gulp.task('default', ['watch']);
} else {
    gulp.task('default', ['dist']);
}
