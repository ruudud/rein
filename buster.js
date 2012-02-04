var config = module.exports;

config['Browser tests'] = {
    libs: ['lib/zepto.min.js', 'lib/underscore.min.js', 'lib/backbone.min.js', 
           'lib/backbone.localStorage.min.js', 'lib/hogan.min.js'],
    sources: ['src/app.js', 'src/**/*.js'],
    tests: ['test/*_test.js'],
    environment: 'browser'
};

// Clean up stack traces from browser tests
var buster = require("buster");
buster.stackFilter.filters.push("buster/bundle");
buster.stackFilter.filters.push("buster/wiring");
