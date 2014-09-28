'use strict';

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({

    watch: {
      jsTest: {
        files: ['test/**/*.js'],
        tasks: ['karma:dev:run']
      }
    },

    clean: {
      dist: {
        files: [{
          src: [
            'build/*'
          ]
        }]
      }
    },

    concat: {
      options: {
        process: function(src, filepath) {
          return src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
        }
      },
      angular: {
        options: {
          banner: "/*! https://github.com/ibtkvi/swiper-repeat */\n(function(angular, window, document, undefined) {'use strict';\n\n",
          footer: "})(angular, window, document);\n"
        },
        src: ['src/*.js','src/adapters/angular.js'],
        dest: 'build/angular/swiperRepeat.js',
      }
    },

    uglify: {
      options: {
        preserveComments: 'some'
      },
      angular: {
        files: {
          'build/angular/swiperRepeat.min.js': 'build/angular/swiperRepeat.js'
        }
      }
    },

    karma: {
      dev: {
        configFile: 'karma.conf.js',
        background: true,
        reporters: 'dots'
      },
      single: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }

  });

  grunt.registerTask('serve', [
    'karma:dev:server',
    'watch'
  ]);

  grunt.registerTask('test', [
    'karma:single'
  ]);

  grunt.registerTask('build', [
    'clean',
    'concat:angular',
    'uglify:angular'
  ]);

};
