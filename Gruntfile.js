module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.sass-cache',
            '.tmp',
            '_site'
          ]
        }]
      }
    },
    connect: {
      server: {
        options: {
          base: '_site/',
          port: 4000,
          open: true,
          hostname: '0.0.0.0'
        }
      }
    },
    shell: {
      prod: {
        command: "jekyll build --config '_config-prod.yml'",
        options: {
          async: false
        }
      },
      dist: {
        command: 'jekyll build',
        options: {
          async: false
        }
      }
    },
    watch: {
      css: {
        files: ['_lib/scss/*.scss'],
        tasks: ['compass:dist'],
      },
      js: {
        files: ['_lib/js/{,*/}*.js'],
        tasks: ['copy:dist'],
      },
      html: {
        files: [
          '{,*/}*.html',
          '{,*/}*.md'
        ],
        tasks: ['shell:dist', 'compass:dist', 'copy:dist']
      }
    },
    compass: {
      dist: {
        options: {
          config: 'config.rb',
          cssDir: '_site/css'
        }
      },
      prod: {
        options: {
          config: 'config.rb',
          cssDir: '.tmp/css'
        }
      }
    },
    copy: {
      dist: {
        expand: true,
        cwd: '_lib/js/',
        src: '{,*/}*.js',
        dest: '_site/js/'
      },
      prod: {
        files : [
          {
            cwd: '.tmp/',
            dest: '_site/',
            src: [
              '*.{ico,png,txt}',
              'fonts/{,*/}*.*'
            ]
          },
          {
            src: '_lib/js/vendor/modernizr-2.6.2.min.js',
            dest: '_site/js/vendor/modernizr-2.6.2.min.js'
          }
        ]
      },
    },
    concat: {
      index: {
        src: [
          '_lib/js/vendor/jquery-1.11.1.min.js',
          '_lib/js/vendor/underscore-min.js',
          '_lib/js/vendor/backbone-min.js',
          '_lib/js/vendor/jquery.mousewheel.js',
          '_lib/js/vendor/jquery.jscrollpane.js',
          '_lib/js/vendor/waypoints.min.js',
          '_lib/js/app.js',
          '_lib/js/ui/navbar.js'
        ],
        dest: '.tmp/js/docs.js',
      }
    },
    uglify: {
      prod: {
        files: {
          '_site/js/docs.min.js': ['.tmp/js/docs.js'],
          '_site/js/index.min.js': ['_lib/js/index.js'],
          '_site/js/editor.min.js': ['_lib/js/editor.js'],
          '_site/js/tutorials.min.js': ['_lib/js/tutorials.js']
        }
      },
    },
    cssmin: {
      prod: {
        files: {
          '_site/css/docs.min.css': [
            '.tmp/**/*.css'
          ]
        }
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/img',
          src: '{,**/}*.{gif,jpeg,jpg,png}',
          dest: '_site/img'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: '.tmp/',
          src: '{,*/}*.html',
          dest: '_site/'
        }]
      }
    }
  });

  grunt.registerTask('build', [
    'clean',
    'shell:prod',
    'copy:prod',
    'concat',
    'uglify',
    'compass:prod',
    'cssmin',
    'imagemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    // 'test',
    'clean',
    'shell:dist',
    'copy:dist',
    'compass:dist',
    'copy:dist',
    'connect',
    'watch'
  ]);
};