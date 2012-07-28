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

// Polyfills
''.trim||(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,'');});
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }
    var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, FNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof FNOP ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
        };
    FNOP.prototype = this.prototype;
    fBound.prototype = new FNOP();

    return fBound;
  };
}
