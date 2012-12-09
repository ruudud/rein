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

I recently spent some time setting up [Grunt](http://gruntjs.com/) for an [offline reindeer mark
register web app](http://rein.ligretto.no/) I'm building at my spare time. In
fact, I sat almost eight hours straight because it appeared to solve every
problem I had, in an easy and fun way.

Grunt is a task based build tool that can do pretty much anything. Sure, you could still use ant, phing, rake, or whatever you are used to using. Though, I think it makes sense to test out and use tools written in the same language as can be found in the project you are working in, i.e. by limiting the scope of the developer environment, and ease the process of writing custom plugins and so on.

Grunt can be installed via [npm](https://npmjs.org/) by running `npm install -g grunt`, 
and you run it by issuing `grunt` in the directory containing the `grunt.js` file.
This will typically be the project root.

In the next sections, I will show some of the tasks I have set up Grunt to run at various times.

## Pre-compile templates

I'm using [Underscore.js templates](http://documentcloud.github.com/underscore/#template),
and it is convenient to write these in .html files and have them converted to
pre-compiled JavaScript Templates (JST) available to be used throughout the
code. Ergo, the client has to do less work, and the views can be rendered
some nano seconds faster.

By using [the JST plugin](https://github.com/gruntjs/grunt-contrib-jst/), 
the following snippet will take all html files found in `src/templates`, compile them,
and finally add them to the `src/templates/compiled.js` file under the namespace variable specified.

```
jst: {
    compile: {
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
}
```

Since this is an extra plugin, remember to load it somewhere in your `grunt.js` file:

```
grunt.loadNpmTasks('grunt-contrib');
```

## Minify

Even though minifying / uglifying the JavaScript source code [might be bad][]
for the open web, reducing the size of the application becomes quite important
for an offline mobile web app when fighting cache limits of 5MB for some
devices.

(The source code of what I'm creating is however freely available under AGPLv3 on [github][].)

```
pkg: '<json:package.json>',
min: {
    dist: {
        src: ['src/app.js', 'src/utils.js', 'src/register.js',
              'src/templates/compiled.js', 'src/setup.js'],
        dest: 'dist/<%= pkg.name %>.modules.min.js'
    }
}
```

Here, the default **min** task will take my source files (including the templates mentioned in the previous section), concatenate, and minify them. Notice how the `package.json` file is read in,
and how a property of this is used in the `dest` property.

 [might be bad]: http://stackoverflow.com/questions/8139679/doesnt-javascript-minification-hurt-open-source
 [github]: https://github.com/ruudud/reindeerfinder


## Concatenate

Even more important for page load speed, is to combine the source files (CSS
and JavaScript separately, of course) to reduce the number of requests the
client has to make to the web server.

This is a built-in task in grunt, and in this more advanced snippet,
you also see how to reference file lists and variables from other places in the file:

```
pkg: '<json:package.json>',
meta: {
    banner: '/* <%= pkg.name %>\n' +
        '* <%= pkg.homepage %> \n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %>' +
        ' <%= pkg.author.name %>\n' +
        '* Licensed under AGPLv3. */'
},
concat: {
    dist: {
        src: ['<banner>', 'lib/modernizr.min.js',
              'lib/underscore.min.js', 'lib/backbone.min.js',
              '<config:min.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
    }
}
```

The end result is a file with a banner at the top, followed by dependencies
and the file generated in the previous section.


## HTML differences between the developer version and production code

Until I get [source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) 
integrated into the build, I like to link the JavaScript source files in to the HTML to easily debug my code. But before creating a release, I would like to link the concatenated and minified file.

From my HTML:
```
<!--(if target dummy)><!-->
<script src="lib/modernizr.min.js" type="text/javascript"></script>
<script src="lib/underscore.min.js" type="text/javascript"></script>
<script src="lib/backbone.min.js" type="text/javascript"></script>
<script src="src/app.js" type="text/javascript"></script>
<script src="src/utils.js" type="text/javascript"></script>
// ...
<!--<!(endif)-->
<!--(if target dist)>
<script src="reindeerfinder.min.js" type="text/javascript"></script>
<script type="text/javascript">var _gaq = _gaq || []; //...
<!(endif)-->
```

And the corresponding grunt configuration:

```
targethtml: {
    dist: {
        input: 'index.html',
        output: 'dist/index.html'
    }
}
```

I use this technique to avoid the [appcache](http://diveintohtml5.info/offline.html) and Google Analytics when testing locally. 


## Do stuff when files change

When developing, I like to have my code tested automatically, both static checks with [jshint](http://jshint.com/) and unit tests with [Buster](http://busterjs.org).

To do this, I use a combination of the **watch** task, and the [Buster plugin](https://npmjs.org/package/grunt-buster).

```
buster: {
    test: { config: 'test/buster.js' }
},
watch: {
    browserscripts: {
        files: ['src/**/*.js'],
        tasks: ['lint:browser']
    },
    tests: {
        files: ['src/**/*.js', 'test/**/*_test.js'],
        tasks: ['buster']
    }
}
```

Again, remember to load the plugin:

```
grunt.loadNpmTasks('grunt-buster');
```

## Defining tasks

To define tasks, which is executed using `grunt <task>`, register them at the bottom of the file like this:

```
grunt.registerTask('release', 'jst lint buster clean:dist min concat mincss targethtml replace copy clean:temp');
```

## Conclusion

You can do a lot of things with Grunt, and so far, I'm very happy with using it.
This was just some examples of what is being done in the [complete file](https://github.com/ruudud/ReindeerFinder/blob/master/grunt.js) I have created for my little project. 

Have a look there to get more inspiration!

Hit [@ruudud](https://twitter.com/ruudud) at Twitter if you have any questions.

