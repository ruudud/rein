exports.config = {
  bundles: [
    { components: ['rein-app', 'rein-areas'] },
    { components: ['rein-area'] },
    { components: ['rein-district'] }
  ],
  collections: [
    { name: '@stencil/router' }
  ],
  serviceWorker: {
    maximumFileSizeToCacheInBytes: 4000000
  }
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
