/*global window: true, Modernizr: true, _load: true*/
$(document).ready(function () {
  var I = REIN.module('ios'), setupMainViews;

  setupMainViews = function () {
    var browse, welcome, topNav, bottomNav, search, loading,
      L = REIN.module('list'), M = REIN.module('main');

    browse = new L.Views.Browse({el: '#browse'});
    browse.render();

    welcome = new M.Views.Welcome({el: '#welcome'});
    topNav = new M.Views.TopNav({el: '#menu'});
    bottomNav = new M.Views.BottomNav({el: '#nav'});

    search = new M.Views.Search({el: '#search'});
    search.render();

    loading = new M.Views.Loading($('#loading'));
    loading.hide();

    window.scrollTo(0, 1);
  };

  if (!I.isInstalled()) {
    I.install();
    return;
  }

  if (Modernizr && !Modernizr.inlinesvg) {
    _load('lib/rgbcolor.min.js');
    _load('lib/canvg-1.2.min.js');
    REIN.tools.trackEvent('svgRenderer', { category: 'device', label: 'canvg' });
  }

  setupMainViews();

  if (window.REINVERSION) {
    REIN.tools.trackEvent('App Version', { label: window.REINVERSION });
  }
});
