/*global Modernizr: true*/
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
        }
    });

    return {
        module: module,
        View: View,
        events: events
    };
}());
