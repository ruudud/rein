module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    aws: grunt.file.readJSON('aws-credentials.json'),
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
    concat: {
      options: { banner: '<%= meta.banner %>' },
      dist: {
        src: ['lib/modernizr-2.6.1.min.js', 'lib/lodash-1.1.1custom.min.js',
          'lib/backbone-1.0.0.min.js', 'dist/temp/<%= pkg.name %>.min.js'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    copy: {
      dist: {
        files: [
          {
            dest: 'dist/',
            src: ['favicon.ico', 'people.txt', 'robots.txt', 'sitemap.xml']
          },
          {
            dest: 'dist/gfx/',
            src: ['*'],
            cwd: 'gfx/',
            expand: true,
            filter: 'isFile'
          },
          {
            dest: 'dist/lib/',
            src: ['zepto-1.0rc1.min.js', 'jquery-1.7.4.min.js',
              'rgbcolor.min.js', 'canvg-1.2.min.js'],
            cwd: 'lib/',
            expand: true
          }
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
            'src/modules/list.js', 'src/modules/ios_install.js',
            'src/setup.js']
        }
      }
    },
    jst: {
      dist: {
        options: {
          namespace: 'REIN.templates',
          processName: function (filename) {
            return filename.split('/').pop().split('.')[0];
          }
        },
        files: {
          'src/templates/compiled.js': ['src/templates/*.html']
        }
      }
    },
    replace: {
      dist: {
        options: {
          variables: { 'version': '<%= pkg.version %>' }
        },
        files: {
          'dist/index.html': 'dist/temp/index.html',
          'dist/': ['rein.appcache', 'manifest.webapp']
        }
      }
    },
    s3: {
      options: {
        bucket: '<%= aws.bucket %>',
        key: '<%= aws.accessKey %>',
        secret: '<%= aws.secretKey %>',
        secure: false,
        access: 'public-read',
        gzipExclude: ['.png'],
        gzip: true
      },
      noCache: {
        options: {
          headers: { 'Cache-Control': 'max-age=3600, must-revalidate' }
        },
        upload: [
          { src: 'dist/rein.appcache', dest: 'rein.appcache' },
          { src: 'dist/manifest.webapp', dest: 'manifest.webapp' },
          { src: 'dist/reindeerfinder.min.css', dest: 'reindeerfinder.min.css' },
          { src: 'dist/reindeerfinder.min.js', dest: 'reindeerfinder.min.js' },
          { src: 'dist/index.html', dest: 'index.html' }
        ]
      },
      cache: {
        options: {
          headers: { 'Cache-Control': 'public, max-age=2592000' }
        },
        upload: [
          { src: 'dist/gfx/*', dest: 'gfx/' },
          { src: 'dist/lib/*', dest: 'lib/' },
          { src: 'dist/favicon.ico', dest: 'favicon.ico' },
          { src: 'dist/people.txt', dest: 'people.txt' },
          { src: 'dist/robots.txt', dest: 'robots.txt' },
          { src: 'dist/sitemap.xml', dest: 'sitemap.xml' }
        ]
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
            'src/modules/list.js', 'src/modules/ios_install.js',
            'src/setup.js']
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
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-targethtml');

  grunt.registerTask('reloadPackageJson', 'Reloads the package.json', function () {
    grunt.config('pkg', grunt.file.readJSON('package.json'));
    grunt.log.writeln('Config reloaded.');
  });

  grunt.registerTask('default', [
    'jshint', 'jst', 'clean:dist', 'uglify', 'concat', 'cssmin', 'targethtml',
    'replace', 'copy', 'clean:temp'
  ]);

  grunt.registerTask('release', [ 'bump', 'reloadPackageJson', 'default', 's3' ]);

};
