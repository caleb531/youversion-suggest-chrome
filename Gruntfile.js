let commonjs = require('rollup-plugin-commonjs');
let resolve = require('rollup-plugin-node-resolve');
let json = require('rollup-plugin-json');

module.exports = function (grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {
        style: 'compressed',
        sourcemap: 'file'
      },
      all: {
        files: [{
          expand: true,
          cwd: 'src/styles',
          src: '*.scss',
          dest: 'dist/styles',
          ext: '.css'
        }]
      }
    },

    rollup: {
      options: {
        format: 'iife',
        moduleName: 'yvs',
        plugins: [
          resolve(),
          commonjs(),
          json()
        ]
      },
      all: {
        files: {
          'dist/scripts/popup.js': ['src/scripts/popup.js']
        }
      }
    },

    watch: {
      pages: {
        files: ['src/*.*', 'src/icons/*.*', 'src/data/**/*.json'],
        tasks: ['copy']
      },
      scripts: {
        files: ['src/scripts/**/*.js'],
        tasks: ['rollup']
      },
      styles: {
        files: ['src/styles/*.scss'],
        tasks: ['sass']
      }
    },

    copy: {
      all: {
        files: [{
            expand: true,
            cwd: 'src',
            src: ['*.*', 'icons/*.*', 'data/**/*.json'],
            dest: 'dist'
        }]
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-rollup');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('build', [
    'copy',
    'sass',
    'rollup'
  ]);

  grunt.registerTask('serve', [
    'build',
    'watch'
  ]);

};
