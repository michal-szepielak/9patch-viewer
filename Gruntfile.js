module.exports = function(grunt) {
	'use strict';

	var CFG = {
            BUILD_PATH: 'dist/',
            SRC_PATH: 'src/'
        },
		JS_FILES = [
			CFG.SRC_PATH + 'js/ImageLoader.js',
			CFG.SRC_PATH + 'js/NinePatch.js',
			CFG.SRC_PATH + 'js/simple-resize.js',
			CFG.SRC_PATH + 'js/main.js'
		],
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
						'dist/js/app.min.js': JS_FILES
					}
				}
			},

			injector: {
				options: {
					template: 'src/index.html',
					addRootSlash: false,
					ignorePath: 'dist'
				},
				dev: {
					files:{
						'dist/index.html' : JS_FILES
					}
				},
				build: {
					files:{
						'dist/index.html' : ['dist/js/*.js']
					}
				}
			},

			less : {
                main: {
                    files: [{
                        src: [CFG.SRC_PATH + 'less/style.less'], dest: CFG.BUILD_PATH + 'css/style.css'
                    }]
                }
			},

			cssmin: {
				options: {
					shorthandCompacting: false,
					roundingPrecision: -1
				},
				target: {
					files: {
						'dist/css/style.css': [CFG.BUILD_PATH + 'css/*.css']
					}
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
	grunt.loadNpmTasks('grunt-injector');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	// Task list
	grunt.registerTask('build', ['clean', 'jslint', 'copy', 'uglify:dist', 'injector:build', 'less', 'cssmin']);
	grunt.registerTask('dev', ['clean', 'copy', 'injector:dev', 'less']);
	grunt.registerTask('default', ['build']);
};
