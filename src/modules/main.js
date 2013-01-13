(function (M, REIN, $, window) {
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
      REIN.tools.trackEvent('toggle', { category: 'nav', label: 'search' });
    }
  });

  M.Views.BottomNav = REIN.View.extend({
    events: { 'click .toTop': '_onClick' },
    _onClick: function () { window.scrollTo(0, 1); }
  });

  M.Views.Search = REIN.View.extend({
    events: {'submit form': '_onSearch'},

    initialize: function () {
      REIN.events.on('toggleSearch', this._onToggleSearch, this);
    },

    render: function () {
      this.$el.append(REIN.templates.search());
      return this;
    },

    _onSearch: function (event) {
      event.preventDefault();
      var needle = this.$('input').val();
      if (needle.length > 1 ) {
        REIN.events.trigger('search', needle);
        REIN.tools.trackEvent('search', { category: 'nav', label: needle });
      }
    },

    _onToggleSearch: function () {
      this.$el.toggle();
    }
  });

  M.Views.Loading = function () {
    this.$body = $('body');
    this.$el = $(REIN.templates.loading());
    this.$body.prepend(this.$el);

    REIN.events.on('loading:start', this._onLoading, this);
    REIN.events.on('loading:end', this._onLoadingEnd, this);
  };
  _.extend(M.Views.Loading.prototype, {
    _onLoading: function () {
      this.$el.show();
      this._blockUI(true);
    },

    _onLoadingEnd: function () {
      this._blockUI(false);
      this.$el.hide();
    },

    _blockUI: function (block) {
      var events = 'click tap touchstart touchmove';
      if (block) {
        this.$el.bind(events, this._eventHandler, false);
        this.$body.css({overflow: 'hidden'});
      } else {
        this.$el.unbind(events, this._eventHandler);
        this.$body.css({overflow: ''});
      }
    },

    _eventHandler: function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    }
  });
}(REIN.module('main'), REIN, $, window));
