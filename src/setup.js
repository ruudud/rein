/*global window: true*/
/*
* Borrowed from http://pattern.dk/sun/.
*/
REIN.install = function () {
    $('body')
        .addClass('loading')
        .show()
        .html(['<div><div class="homescreen">',
               '  <section class="desc">',
               '  <h2 class="add">Legg til på <strong>Hjem-skjermen</strong></h2>',
               '  <h4 class="help">',
               '    <a href="http://www.apple.com/no/ios/add-to-home-screen/">',
               '      Hvordan?',
               '    </a>',
               '  </h4>',
               '  </section>',
               '</div></div>'].join('\n'));
};
$(document).ready(function () {
    var setupMainViews = function () {
        var browse, welcome, topNav, bottomNav, markList, search, loading,
            L = REIN.module('list'), M = REIN.module('main');

        browse = new L.Views.Browse({el: '#browse'});
        browse.render();

        welcome = new M.Views.Welcome({el: '#welcome'});
        topNav = new M.Views.TopNav({el: '#menu'});
        bottomNav = new M.Views.BottomNav({el: '#nav'});

        markList = new L.Views.MarkList({
            collection: REIN.Register
        });
        $('#marks').html(markList.render().el);

        search = new M.Views.Search({collection: REIN.Register, el: '#search'});
        search.render();

        loading = new M.Views.Loading();

        window.scrollTo(0, 1);
    };

    if ($.os && $.os.ios) {
        if (!window.navigator.standalone) {
            REIN.install();
            REIN.tools.trackPageView('iphone_install/start');
            return false;
        } else {
            REIN.tools.trackPageView('iphone_install/complete');
        }
    }
    setupMainViews();
});
