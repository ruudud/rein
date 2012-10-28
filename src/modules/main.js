(function (M, REIN, $) {
    M.Views.Welcome = REIN.View.extend({
        events: { 'click .close': '_onClose' },
        _onClose: function (event) {
            event.preventDefault();
            this.$el.hide();
            if (Modernizr.localstorage) {
                localStorage.setItem('welcomeClosed', '1');
            }
        }
    });
    M.Views.TopNav = REIN.View.extend({
        searchActive: false,
        events: { 'click .search': '_onSearchClick' },
        _onSearchClick: function (event) {
            event.preventDefault();
            this.$('.search').toggleClass('active');
            this.searchActive = !this.searchActive;
            REIN.events.trigger('toggleSearch', this.searchActive);
            REIN.tools.trackEvent('nav', 'toggle', 'search');
        }
    });

    M.Views.BottomNav = REIN.View.extend({
        events: { 'click .toTop': '_onClick' },
        _onClick: function () { window.scrollTo(0, 1); }
    });
}(REIN.module('main'), REIN, $));
