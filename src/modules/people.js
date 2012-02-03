// This module handles the owner register
(function (P, E) {
    var _fillDB;

    P.init = function () {
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
        75: 'VJ 10 - TJÅEHKERE SIJTE',
        76: 'VM 11 - ÅARJEL-NJAARKE',
        77: 'VR 6 - FOVSEN-NJAARKE'
    };

    P.Models.Owner = Backbone.Model.extend({ });

    P.Collections.Owners = Backbone.Collection.extend({
        model: P.Models.Owner,
        localStorage: new Store('ReindeerOwners'),
        _activeDistricts: [],

        initialize: function () {
            E.on('filter:district', this.filterByDistrict, this);
        },

        filterByDistrict: function (enable, districtId) {
            if (arguments.length < 2) {
                return this.models;
            }
            var activeDistricts = this._updateActiveDistricts(enable, districtId);

            return this.filter(function (owner) {
                var match = _.indexOf(activeDistricts, owner.get('district')); 
                return match > -1;
            });
        },
        
        _updateActiveDistricts: function (enable, districtId) {
            var districtIndex = _.indexOf(this._activeDistricts, districtId);
            if (enable) {
                if (districtIndex < 0) {
                    this._activeDistricts.push(districtId);
                }
            } else {
                if (districtIndex > -1) {
                    this._activeDistricts = _.without(this._activeDistricts,
                                                      districtId);
                }
            }
            return this._activeDistricts;
        }

    });


    // Utility function s
    _fillDB = function (collection, rawData) {
        _.each(rawData, function (p) {
            collection.create(p);
        });
    };

}(REINMERKE.module('people'), REINMERKE.events));
