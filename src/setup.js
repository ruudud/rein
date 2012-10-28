$(document).ready(function () {
    var browse, welcome, topNav, bottomNav, markList, search,
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

    window.scrollTo(0, 1);
});
