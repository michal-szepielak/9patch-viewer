module.exports = function(grunt) {
	'use strict';

	var CFG = {
            BUILD_PATH: 'dist/',
            SRC_PATH: 'src/'
        },
        initConfig = {
			pkg: grunt.file.readJSON('package.json'),

			clean: {
				dist: [CFG.BUILD_PATH + '/']
			},

			copy: {
				main: {
					cwd: CFG.SRC_PATH,
					expand: true,
					src: ['./**', '!./less/**', '!./js/**'],
					dest: CFG.BUILD_PATH
				}
			},

			jslint: {
				'main-js': {
					src: [CFG.SRC_PATH + 'js/**/*.js'],
					directives: {
						browser: true,
						todo: true,
						plusplus: true,
						predef: ['window', 'document']
					}
				}
			},

			uglify: {
				dist: {
					files: {
						'dist/js/app.min.js': ['src/js/ImageLoader.js', 'src/js/NinePatch.js', 'src/js/simple-resize.js', 'src/js/main.js']
					}
				}
			},

			less : {
                main: {
                    files: [{
                        src: [CFG.SRC_PATH + '/less/style.less'], dest: CFG.BUILD_PATH + '/css/style.css'
                    }]
                }
			}
		};
	grunt.initConfig(initConfig);


	// npm tasks
	grunt.loadNpmTasks('grunt-jslint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Task list
 	grunt.registerTask('build', ['clean', 'jslint', 'copy', 'uglify:dist', 'less']);
	grunt.registerTask('default', ['build']);
};
