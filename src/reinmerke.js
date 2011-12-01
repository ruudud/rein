var REINMERKE = (function() {
    var modules = {}, init, module;

    init = function() {
        REINMERKE.module('people').init();
        REINMERKE.module('drawear').init();
    };

    module = function(name) {
        if (modules[name]) {
            return modules[name];
        }

        modules[name] = { Views: {}, Models: {}, Collections: {} };
        return modules[name];
    };

    return {
        init: init,
        module: module,
    };
}());

jQuery(function($) {
    REINMERKE.init();
});


