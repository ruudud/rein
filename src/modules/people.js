// This module handles the owner register
(function(P){
    var _fillDB;

    P.init = function() {
        P.Owners = P.Owners || new P.Collections.Owners();
        P.Owners.fetch();

        if (P.Owners.length !== P.register.length) {
            localStorage.clear();
            _fillDB(P.Owners, P.register);
        }
    };

    P.Models.Owner = Backbone.Model.extend({ });

    P.Collections.Owners = Backbone.Collection.extend({
        model: P.Models.Owner,
        localStorage: new Store('ReindeerOwners'),
    });


    // Utility Functions
    _fillDB = function(collection, rawData) {
        _.each(rawData, function(p) {
            collection.create(p);
        });
    };

}(REINMERKE.module('people')));
