(function(P, F){
    var fillDB;

    P.init = function(skipViews) {
        P.Owners = P.Owners || new P.Collections.Owners();
        P.Owners.fetch();

        if (P.Owners.length < 1) {
            fillDB(P.Owners);
        }

        if (!skipViews) {
            P.resultsView = new P.Views.Results({collection: P.Owners});
            P.resultsView.render();
        }
    };

    // Views
    P.Views.Results = Backbone.View.extend({
        el: $('#search_results'),

        initialize: function() {
            this.update(this.collection);
        },

        render: function() {
            var that = this;
            this.el.empty();

            _.each(this.searchHits, function(sh) {
                that.el.append(sh.render().el);
            });
        },

        update: function(collection) {
            var that = this;
            this.collection = collection;
            this.searchHits = [];

            this.collection.each(function(owner) {
                that.searchHits.push(new P.Views.SearchHit({model: owner}));
            });
        }
    });

    P.Views.SearchHit = Backbone.View.extend({
        template: $('#search_hit_template').html() || '',

        render: function() {
            this.el = _.template(this.template, this.model.toJSON());
            return this;
        }
    });


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

            P.resultsView.update(this.searchResult);
            P.resultsView.render();
        }
    });


    // Utility Functions

    fillDB = function(collection) {
        _.each(P.register, function(p) {
            collection.create(p);
        });
    };

}(REINMERKE.module('people'), REINMERKE.module('findbyear')));
