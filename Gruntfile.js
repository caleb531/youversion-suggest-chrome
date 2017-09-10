const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');

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
          commonjs()
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
        files: ['src/*.html'],
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
            src: [
              '*.html',
              'manifest.json',
              'icon.png',
              'bible/*.json'
            ],
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
