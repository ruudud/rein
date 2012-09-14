module.exports = function (grunt) {
    grunt.initConfig({
        pkg: '<json:package.json>',
        meta: {
            banner: '/* <%= pkg.name %>\n' +
                '* <%= pkg.homepage %> \n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %>' +
                ' <%= pkg.author.name %>\n' +
                '* Licensed under AGPLv3. */'
        },
        jst: {
            compile: {
                options: {
                    namespace: 'REINMERKE\'][\'templates',
                    processName: function (filename) {
                        return filename.split('/').pop().split('.')[0];
                    }
                },
                files: {
                    'src/templates/compiled.js': ['src/templates/*.html']
                }
            }
        },
        min: {
            dist: {
                src: ['src/app.js', 'src/utils.js', 'src/mark_register.js',
                      'src/cuts.js',
                      'src/modules/widgets.js', 'src/modules/list.js',
                      'src/setup.js'],
                dest: 'dist/temp/<%= pkg.name %>.min.js'
            },
            templates: {
                src: ['src/templates/compiled.js'],
                dest: 'dist/temp/templates.min.js'
            }
        },
        concat: {
            dist: {
                src: ['<banner>', 'lib/modernizr.min.js',
                      'lib/underscore.min.js', 'lib/backbone.min.js',
                      '<config:min.dist.dest>', '<config:min.templates.dest>'],
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        mincss: {
            compress: {
                files: {
                    'dist/<%= pkg.name %>.min.css': [
                        '<banner>', 'css/inuit.css', 'css/reinmerke.css']
                }
            }
        },
        targethtml: {
            dist: {
                input: 'index.html',
                output: 'dist/temp/index.html'
            }
        },
        replace: {
            dist: {
                src: ['rein.appcache', 'dist/temp/index.html'],
                dest: 'dist/',
                variables: {version: '<%= pkg.version %>'}
            }
        },
        copy: {
            dist: {
                files: {
                    'dist/gfx': 'gfx/*',
                    'dist/': ['favicon.ico', 'people.txt'],
                    'dist/lib': ['lib/zepto.min.js', 'lib/jquery.min.js',
                                 'lib/rgbcolor.min.js', 'lib/canvg.min.js']
                }
            }
        },
        clean: ['dist/temp'],
        lint: {
            node: ['grunt.js'],
            browser: ['<config:min.dist.src>']
        },
        jshint: {
            options: {
                browser: true,
                undef: true,
                expr: true,
                trailing: true,
                eqeqeq: true,
                onevar: true,
                curly: true
            },
            globals: {},
            node: { options: { node: true } },
            browser: { 
                globals: {
                    REINMERKE: true,
                    Backbone: true,
                    _: true,
                    jQuery: true,
                    localStorage: true
                }
            }
        },
        watch: {
            templates: {
                files: ['src/templates/*.html'],
                tasks: 'jst:compile'
            },
            scripts: {
                files: ['<config:min.dist.src>'],
                tasks: 'lint:browser'
            }
        }
    });

    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-targethtml');

    grunt.registerTask('default', 'lint jst min concat mincss targethtml replace copy clean');
};
