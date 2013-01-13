/*global window: true*/
$(document).ready(function () {
  var setupMainViews = function () {
    var browse, welcome, topNav, bottomNav, search, loading,
      L = REIN.module('list'), M = REIN.module('main');

    browse = new L.Views.Browse({el: '#browse'});
    browse.render();

    welcome = new M.Views.Welcome({el: '#welcome'});
    topNav = new M.Views.TopNav({el: '#menu'});
    bottomNav = new M.Views.BottomNav({el: '#nav'});

    search = new M.Views.Search({el: '#search'});
    search.render();

    loading = new M.Views.Loading();

    window.scrollTo(0, 1);
  };

  if ($.os && $.os.ios) {
    if (!window.navigator.standalone) {
      $('body')
        .addClass('loading')
        .show()
        .html(REIN.templates.install());
      REIN.tools.trackPageView('iphone_install/start');
      return false;
    } else {
      REIN.tools.trackPageView('iphone_install/complete');
    }
  }
  setupMainViews();
});
