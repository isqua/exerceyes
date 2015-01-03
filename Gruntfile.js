module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            options: {},
            build: {
                src: 'src/script.js',
                dest: 'dest/script.js'
            }
        },

        autoprefixer: {
            options: {},
            development: {
                src: 'src/style.css',
                dest: 'src/style.ap.css'
            },
            production: {
                src: 'src/style.css',
                dest: 'tmp/style.css'
            }
        },

        cssmin: {
            target: {
                files: {
                    'dest/style.css': [ 'tmp/style.css' ]
                }
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dest/index.html': 'src/index.html'
                }
            },
        },

        watch: {
            files: [ 'src/style.css' ],
            tasks: [ 'autoprefixer:development' ]
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build:production', [ 'uglify', 'autoprefixer:production', 'cssmin', 'htmlmin' ]);

};
