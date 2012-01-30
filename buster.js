var config = module.exports;

config['Browser tests'] = {
    libs: ['lib/zepto.min.js', 'lib/underscore.js', 'lib/backbone.js', 
           'lib/backbone.localStorage.js'],
    sources: ['src/app.js', 'src/**/*.js'],
    tests: ['test/*_test.js'],
    environment: 'browser'
};

// Clean up stack traces from browser tests
var buster = require("buster");
buster.stackFilter.filters.push("buster/bundle");
buster.stackFilter.filters.push("buster/wiring");
