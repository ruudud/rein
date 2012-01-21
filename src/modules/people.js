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

    // Models and Collections

    P.Models.Owner = Backbone.Model.extend({ });

    P.Collections.Owners = Backbone.Collection.extend({
        model: P.Models.Owner,
        localStorage: new Store('ReindeerOwners'),

        search: function(pos, currentCuts) {
            var cutsMap, matching;

            this.searchResult = this.searchResult || new P.Collections.Owners(this.models);

            cutsMap = {};
            currentCuts.each(function(cut) {
                var type = cut.get('cutType');
                if (type === 'a,b') {
                    if (cutsMap.a) {
                        cutsMap.a += 'a';
                    } else {
                        cutsMap.a = 'a';
                    }
                } else {
                    if (cutsMap[type]) {
                        cutsMap[type] += type;
                    } else {
                        cutsMap[type] = type;
                    }
                }
            });

            matching = this.searchResult.filter(function(owner) {
                var cutsAtPosOwner, match = true;
                cutsAtPosOwner = owner.get(pos) || '';

                _.each(cutsMap, function(cutVal) {
                    if (cutVal.indexOf('a') > -1) {
                        if (cutsAtPosOwner.indexOf(cutVal) < 0 &&
                                cutsAtPosOwner.indexOf(cutVal.replace(/a/g, 'b')) < 0) {
                            match = false;
                        }
                    } else {
                        if (cutsAtPosOwner.indexOf(cutVal) < 0) {
                            match = false;
                        }
                    }
                });
                return match;
            });
            this.searchResult = new P.Collections.Owners(matching);
            return this.searchResult;
        },

        resetSearch: function() {
            this.searchResult = new P.Collections.Owners(this.models);
        },

        getCurrentSearchResult: function() {
            return this.searchResult;
        }

    });


    // Utility Functions
    _fillDB = function(collection, rawData) {
        _.each(rawData, function(p) {
            collection.create(p);
        });
    };

}(REINMERKE.module('people')));
