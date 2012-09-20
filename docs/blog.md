# From the toolbox: Grunt

Developing a modern web page (or *web app*) is complex. In addition to all the
standards of W3C, along with its best practices that has evolved over the
years, you need to have JavaScript that runs efficiently and are organized in
such a way that it is easy to maintain as the code grows.

The site you are creating has to look and behave consistently cross different
browsers and platforms, such as tablets and phones. And it has to do [a lot of
things](https://www.scirra.com/blog/74/making-a-fast-website) to be fast.
Lastly, the process of releasing updates has to be as painless and quick as
possible.

So how do we cope with all of these requirements? We use tools.

## Grunt -- a task based build tool

I recently spent some time setting up grunt for an [offline reindeer mark
register web app](http://rein.ligretto.no/) I'm building at my spare time. In
fact, I sat almost eight hours straight because it appeared to solve every
problem I had, in an easy and fun way.

TODO: Installation and basic setup (with plugins). Code examples along the way.


### 1. Pre-compile templates

I'm using [Underscore.js templates](http://documentcloud.github.com/underscore/#template),
and it is convenient to write these in .html files and have them converted to
pre-compiled JavaScript Templates (JST) available to be used throughout the
code. Ergo, the client has to do less work, and the views can be shown
faster.

I had to fiddle a bit with the `namespace` and `processName` settings:

    jst: {
        compile: {
            options: {
                namespace: 'REIN\'][\'templates',
                processName: function (filename) {
                    return filename.split('/').pop().split('.')[0];
                }
            },
            files: {
                'src/templates/compiled.js': ['src/templates/*.html']
            }
        }
    }

### 2. Minify

Even though minifying / uglifying the JavaScript source code [might be bad][]
for the open web, reducing the size of the application becomes quite important
for an offline mobile web app when fighting cache limits of 5MB for some
devices.

(The source code is however freely available under AGPLv3 on [github][].)

    min: {
        dist: {
            src: ['src/app.js', 'src/utils.js', 'src/register.js',
                  'src/templates/compiled.js', 'src/setup.js'],
            dest: 'dist/temp/<%= pkg.name %>.min.js'
        }
    },

 [might be bad]: http://stackoverflow.com/questions/8139679/doesnt-javascript-minification-hurt-open-source
 [github]: https://github.com/ruudud/reindeerfinder

### 3. Concatenate

Even more important for page load speed, is to combine the source files (CSS
and JavaScript separately, of course) to reduce the number of requests the
client has to make to the web server.

This is a built-in task in grunt, and here you also see how to reference file
lists and variables from other places in the file:

    concat: {
        dist: {
            src: ['<banner>', 'lib/modernizr.min.js',
                  'lib/underscore.min.js', 'lib/backbone.min.js',
                  '<config:min.dist.dest>'],
            dest: 'dist/<%= pkg.name %>.min.js'
        }
    },

### 4. HTML differences between developer and production
 - Modify the HTML file
     - Replace links to source files with a link to the minified version
     - Add the cache manifest attribute to the `<html>` tag
 - Bump version and inject this various places
 - Copy files to prepare for release

### 5. Do stuff when files change
 - Watch files for changes
     - Compile templates
     - Run static code checks with [JSHint](http://www.jshint.com/)
     - Run [Buster.js](http://busterjs.org/) tests on a
       [Phantom.js](http://phantomjs.org/) headless browser
