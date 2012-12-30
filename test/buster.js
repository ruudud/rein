var config = module.exports;

config['Browser tests'] = {
  rootPath: '../',
  libs: ['lib/zepto.min.js', 'lib/underscore.min.js', 'lib/**/*.js'],
  sources: ['src/app.js', 'src/templates/compiled.js',
    'src/modules/widgets.js', 'src/**/*.js'],
  tests: ['test/*_test.js'],
  environment: 'browser'
};
