(function(F, P, PA, E, $) {

    F.init = function() {
        F.earsView = new E.Views.Ears();
        F.cuts = E.SouthSamiCuts();
        F.cutView = new E.Views.Cuts({
            collection: F.cuts,
            onDrop: F._updateSearch,
            validDrops: [
                F.earsView.rightEar.front,
                F.earsView.rightEar.side,
                F.earsView.rightEar.back
            ]
        });
        F.resetView = new F.Views.Reset({el: $('#reset')});
        F.resultsView = new F.Views.Results({collection: P.Owners});
        F.resultsView.render();
    };

    F.Views.Reset = Backbone.View.extend({
        events: {'click': 'resetSearch'},

        resetSearch: function() {
            P.Owners.resetSearch();
            F.earsView.clearCuts();

            F.resultsView.update(P.Owners.getCurrentSearchResult());
            F.resultsView.render();
        }
    });

    F.Views.Results = Backbone.View.extend({
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
                that.searchHits.push(new F.Views.SearchHit({model: owner}));
            });
        }
    });

    F.Views.SearchHit = Backbone.View.extend({
        template: $('#search_hit_template').html() || '',

        render: function() {
            this.el = _.template(this.template, this.model.toJSON());
            return this;
        }
    });

    F._updateSearch = function(part, cut) {
        PA.draw(cut, part);
        part.cuts.add(cut);
        var searchResult = P.Owners.search(part.options.name, part.cuts);
        F.resultsView.update(searchResult);
        F.resultsView.render();
    };


}(REINMERKE.module('findbyear'), REINMERKE.module('people'), REINMERKE.module('painter'), REINMERKE.module('ears'), jQuery));
