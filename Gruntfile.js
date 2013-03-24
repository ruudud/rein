module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/* <%= pkg.name %>\n' +
        '* <%= pkg.homepage %> \n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %>' +
        ' <%= pkg.author.name %>\n' +
        '* Licensed under AGPLv3. */'
    },
    clean: {
      dist: ['dist'],
      temp: ['dist/temp']
    },
    exec: {
      gzip: {
        cmd: "find dist/ -type f | while read f; do gzip -9 $f; done"
      },
      move: {
        cmd: "find dist/ -type f -name '*.gz' | while read f; do mv \"$f\" \"${f%.gz}\"; done"
      }
    },
    concat: {
      options: { banner: '<%= meta.banner %>' },
      dist: {
        src: ['lib/modernizr.min.js', 'lib/underscore.min.js',
          'lib/backbone.min.js', 'dist/temp/<%= pkg.name %>.min.js'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    copy: {
      dist: {
        files: [
          { dest: 'dist/', src: ['favicon.ico', 'people.txt', 'robots.txt', 'sitemap.xml'] },
          { dest: 'dist/gfx/', cwd: 'gfx/', src: ['*'], expand: true, filter: 'isFile' },
          { dest: 'dist/lib/', cwd: 'lib/', src: ['zepto.min.js', 'jquery.min.js', 'rgbcolor.min.js', 'canvg.min.js'], expand: true }
        ]
      }
    },
    cssmin: {
      options: { banner: '<%= meta.banner %>' },
      compress: {
        files: {
          'dist/<%= pkg.name %>.min.css': ['css/inuit.css', 'css/reinmerke.css']
        }
      }
    },
    jshint: {
      options: { jshintrc: 'jshintrc' },
      node: {
        options: { node: true },
        files: {
          src: ['Gruntfile.js']
        }
      },
      browser: {
        options: {
          globals: {
            REIN: true, Backbone: true, _: true, $: true, localStorage: true
          }
        },
        files: {
          src: ['src/app.js', 'src/utils.js', 'src/mark_register.js',
            'src/cuts.js', 'src/modules/widgets.js', 'src/modules/list.js',
            'src/modules/list.js', 'src/setup.js']
        }
      }
    },
    jst: {
      options: {
        namespace: 'REIN.templates',
        processName: function (filename) {
          return filename.split('/').pop().split('.')[0];
        }
      },
      files: {
        'src/templates/compiled.js': ['src/templates/*.html']
      }
    },
    replace: {
      dist: {
        options: {
          variables: { 'version': '<%= pkg.version %>' }
        },
        files: {
          'dist/index.html': 'dist/temp/index.html',
          'dist/': ['rein.appcache']
        }
      }
    },
    targethtml: {
      dist: {
        files: {
          'dist/temp/index.html': 'index.html'
        }
      }
    },
    uglify: {
      build: {
        files: {
          'dist/temp/<%= pkg.name %>.min.js': [
            'src/app.js', 'src/utils.js', 'src/mark_register.js',
            'src/cuts.js', 'src/templates/compiled.js',
            'src/modules/widgets.js', 'src/modules/main.js',
            'src/modules/list.js', 'src/setup.js']
        }
      }
    },
    watch: {
      templates: {
        files: ['src/templates/*.html'],
        tasks: ['jst']
      },
      nodescripts: {
        files: ['<%= jshint.node.files.src %>'],
        tasks: ['jshint:node']
      },
      tests: {
        files: ['src/**/*.js', 'test/**/*_test.js'],
        tasks: ['jshint:browser']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-targethtml');

  grunt.registerTask('default', [
      'jshint', 'jst', 'clean:dist', 'uglify', 'concat', 'cssmin', 'targethtml',
      'replace', 'copy', 'clean:temp', 'exec:gzip', 'exec:move'
    ]);

};
