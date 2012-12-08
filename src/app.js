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

    return {
        module: module,
        View: Backbone.View,
        events: events
    };
}());
