var REINMERKE = (function() {
    var modules = {}, init, module;

    module = function(name) {
        if (modules[name]) {
            return modules[name];
        }

        modules[name] = { Views: {}, Models: {}, Collections: {} };
        return modules[name];
    };

    return {
        module: module,
    };
}());

