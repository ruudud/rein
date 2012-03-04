$(document).ready(function () {
    var navBar, NavigationView;

    NavigationView = Backbone.View.extend({
        initialize: function () {
            _.bindAll(this, '_onClick');
            this.$('.toTop').onpress(this._onClick);
        },
        _onClick: function () {
            window.scrollTo(0, 1);
        }
    });

    REINMERKE.module('list').init();
    window.scrollTo(0, 1);

    navBar = new NavigationView({el: '#nav'});
});
