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

        search: function(pos, matchingCuts) {
            var cuts, matching;
            cuts = matchingCuts.split(',');
            this.searchResult = this.searchResult || new P.Collections.Owners(this.models);
            matching = this.searchResult.filter(function(owner) {
                var match = false;
                _.each(cuts, function(cut) {
                    if (owner.get(pos) && owner.get(pos).indexOf(cut) > -1) {
                        match = true;
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

}(REINMERKE.module('people'), REINMERKE.module('drawear')));
