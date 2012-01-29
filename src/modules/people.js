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

    P.Districts = {
        72: 'VA 7 - GASKEN-LAANTE',
        73: 'VF 8 - SKÆHKERE',
        74: 'VG 9 - LÅARTE',
        75: 'VJ 10 - Tjåehkere sijte',
        76: 'VM 11 - ÅARJEL-NJAARKE',
        77: 'VR 6 - FOVSEN-NJAARKE'
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
