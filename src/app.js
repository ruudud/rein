var REINMERKE = (function () {
    var modules = {}, events = {}, init, module;

    _.extend(events, Backbone.Events); 

    module = function (name) {
        if (modules[name]) {
            return modules[name];
        }

        modules[name] = { Views: {}, Models: {}, Collections: {} };
        return modules[name];
    };

    return {
        module: module,
        events: events
    };
}());

