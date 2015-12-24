/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp     = require('gulp');

gulp.task('watch', ['watchify', 'browserSync'], function () {
    // Watchify will watch and recompile our JS, so no need to gulp.watch it
});
