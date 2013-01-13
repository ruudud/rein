(function (W, REIN) {
  W.Views.ListItem = REIN.View.extend({
    tagName: 'li',
    className: 'item',
    _active: false,
    _eventBus: null,
    events: {
      'click': '_onClick'
    },

    initialize: function () {
      this._eventBus = this.options.eventBus;
    },

    render: function () {
      this.$el.html(this.options.template({
        m: this.model
      }));
      return this;
    },

    reset: function () {
      this._active = false;
    },

    _onClick: function (event) {
      event.preventDefault();
      this.$el.addClass('selected').siblings('.selected').removeClass('selected');
      this._eventBus.trigger('item:click', parseInt(this.model.id, 10));
      return;
    }
  });
}(REIN.module('widget'), REIN));
