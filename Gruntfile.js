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

    webpack: {
      all: {
        entry: './src/scripts/popup.js',
        devtool: 'cheap-source-map',
        output: {
          filename: './dist/scripts/popup.js',
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
        tasks: ['webpack']
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
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('build', [
    'copy',
    'sass',
    'webpack'
  ]);

  grunt.registerTask('serve', [
    'build',
    'watch'
  ]);

};
