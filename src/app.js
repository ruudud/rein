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
        formatEvents: function(events) {
            var e, event, eventObj, eventTuple, key, tapType, _i, _len;
            tapType = window.ontouchstart != null ? 'tap' : 'click';
            eventObj = {};
            for (_i = 0, _len = events.length; _i < _len; _i++) {
                event = events[_i];
                eventTuple = (function() {
                    var _j, _len2, _ref, _results;
                    _ref = event.split(',');
                    _results = [];
                    for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
                        e = _ref[_j];
                        _results.push(e.trim());
                    }
                    return _results;
                })();
                key = eventTuple[0].length > 0 ? tapType + ' ' + eventTuple[0] : tapType;
                eventObj[key] = eventTuple[1].trim();
            }
            return eventObj;
        }
    });

    return {
        module: module,
        View: View,
        events: events
    };
}());

