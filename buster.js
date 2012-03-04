var config = module.exports;

config['Browser tests'] = {
    libs: ['lib/zepto.min.js', 'lib/zepto.onpress.js', 'lib/underscore.min.js',
           'lib/backbone.min.js', 'lib/hogan.min.js'],
    sources: ['src/app.js', 'src/modules/widgets.js', 'src/**/*.js'],
    tests: ['test/*_test.js'],
    environment: 'browser'
};
