var watchMode = (process.argv.slice(2).indexOf('--watch') >= 0);
var dest = './demo/v1.3/lib',
    src = './src';


module.exports = {
    unit: {
        tests: ['src/**/test/unit/*.js'],
        src: ['src/*/*.js']
    },
    buildMode: {
        watch: watchMode
    },
    browserSync: {
        server: {
            // Serve up our build folder
            baseDir: dest
        }
    },
    /*translate: {
        src: [
            src + '/' + appFolder + '/translation/po/*.po'
        ],
        dest: dest + '/' + appFolder + '/translation/lang',
        options: {
            'format': 'mf'
        }
    },*/
    browserify: {
        debug: true,
        // A separate bundle will be generated for each
        // bundle config in the list below
        bundleConfigs: [
            {
                entries: src + '/app.js',
                dest: dest,
                outputName: 'rando3D.js'
            }
        ]
    }
};
