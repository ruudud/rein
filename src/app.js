var REINMERKE = (function () {
    var modules = {}, events = {}, init, module, View;

    _.extend(events, Backbone.Events);

    module = function (name) {
        if (modules[name]) {
            return modules[name];
        }

        modules[name] = { Views: {}, Models: {}, Collections: {} };
        return modules[name];
    };

    View = Backbone.View.extend({
        delegateEvents: function (events) {
            if (!(events || (events = this.events))) return;
            var isTouch = window.ontouchstart != null;
            for (var key in events) {
                if (isTouch) {
                    events[key.replace('click', 'tap')] = events[key];
                    delete events[key]
                }
            }
            Backbone.View.prototype.delegateEvents.call(this, events);
        }
    });

    return {
        module: module,
        View: View,
        events: events
    };
}());

