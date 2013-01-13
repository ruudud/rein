/*global Modernizr: true*/
var REIN = (function () {
  var modules = {}, events = {}, init, module, View;

  _.extend(events, Backbone.Events, {
    onMultiple: function (eNameToFnMap, ctx) {
      _.each(eNameToFnMap, function (fn, eventName) {
        this.on(eventName, fn, ctx);
      }, this);
    }
  });

  module = function (name) {
    if (modules[name]) {
      return modules[name];
    }

    modules[name] = { Views: {}, Models: {}, Collections: {} };
    return modules[name];
  };

  View = Backbone.View.extend({
    assign: function (subviews) {
      var view, selector;
      for (view in subviews) {
        selector = (view[0] === '.') ? view : '.' + view;
        subviews[view].setElement(this.$(selector)).render();
      }
    },
    delegateEvents: function (events) {
      if (!(events || (events = this.events))) {
        return;
      }
      var key, tapEvents = _.extend({}, events);
      if (Modernizr.touch) {
        for (key in tapEvents) {
          if (key.indexOf('click') > -1) {
            tapEvents[key.replace('click', 'tap')] = tapEvents[key];
            delete tapEvents[key];
          }
        }
      }
      Backbone.View.prototype.delegateEvents.call(this, tapEvents);
    },
    hide: function () {
      this.$el.hide();
    },
    show: function () {
      this.$el.show();
      this.$el.css({opacity: 1});
    },
    scrollTo: function () {
      window.scrollTo(0, this.$el.offset().top);
    }
  });

  return {
    module: module,
    View: View,
    events: events
  };
}());
