/*global REINMERKE: true, Modernizr: true, canvg: true*/
(function (L, P, W, REIN) {

    L.init = function () {
        this.browse = new L.Views.Browse({el: '#browse'});
        this.browse.render();

        this.topNav = new L.Views.TopNav({el: '#menu'});
        this.bottomNav = new L.Views.BottomNav({el: '#nav'});

        var marks = new L.Collections.Marks();
        this.markList = new L.Views.MarkList({
            collection: marks.reset(P.register)
        });
        $('#marks').html(this.markList.render().el);

        REIN.events.on('toggleSearch', function (active) {
            if (!active) {
                this.browse.show();
                this.markList.empty();
            }
        }, this);
        REIN.events.on('search', function () {
            this.browse.hide();
            this.browse.reset();
        }, this);

        this.search = new L.Views.Search({collection: marks, el: '#search'});
        this.search.render();
    };

    L.Views.TopNav = REIN.View.extend({
        searchActive: false,
        events: { 'click .search': '_onSearchClick' },
        _onSearchClick: function (event) {
            event.preventDefault();
            this.$('.search').toggleClass('active');
            this.searchActive = !this.searchActive;
            REIN.events.trigger('toggleSearch', this.searchActive);
        }
    });

    L.Views.BottomNav = REIN.View.extend({
        events: { 'click .toTop': '_onClick' },
        _onClick: function () { window.scrollTo(0, 1); }
    });

    L.Views.Search = REIN.View.extend({
        events: {'click .search': '_onSearchClick'},

        initialize: function () {
            REIN.events.on('toggleSearch', this._onToggleSearch, this);
        },

        render: function () {
            this.$el.append(this.template());
            return this;
        },

        _onSearchClick: function (event) {
            event.preventDefault();
            var needle = this.$('input').val();
            REIN.events.trigger('search', needle);
        },

        _onToggleSearch: function () {
            this.$el.toggle();
        },

        template: _.template([
            '<form method="post" action=".">',
            '  <input type="text" placeholder="Navn på eier" class="wide boxed">',
            '  <input type="submit" class="wide button btnText search" value="Søk">',
            '</form>',
        ].join('\n'))
    });

    L.Views.Browse = REIN.View.extend({
        initialize: function () {
            this.areas = new L.Views.Areas({collection: P.Areas});
            this.areas.on('area', this._onBrowseArea, this);
            this.districtList = new L.Views.Districts();
        },

        render: function () {
            this.$('.areas').html(this.areas.render().el);
            return this;
        },

        reset: function () {
            this.areas.reset();
            this.$('.districts').html('');
            this.districtList.remove();
        },

        hide: function () {
            this.$el.hide();
        },

        show: function () {
            this.$el.show();
        },

        _onBrowseArea: function (active, id) {
            var $districts = this.$('.districts');
            this.districtList = new L.Views.Districts({collection: P.Areas[id].districts});
            $districts.html('<h2>Velg distrikt</h2>');
            $districts.append(this.districtList.render().el);

            $districts.css({opacity: 1});
            REIN.events.trigger('filter:area', id);

            //TODO: Make smoother or remove
            window.scrollTo(0, $districts.offset().top);
        }
    });

    L.Views.Areas = W.Views.List.extend({
        //itemTemplate: _.template('<a href="#"><%= name %></a>'),
        initialize: function () {
            this.options.singleElementActive = true;
            this.on('item:click', this._onAreaClick, this);
        },

        _onAreaClick: function (active, id) {
            this.trigger('area', active, id);
        }
    });

    L.Views.Districts = W.Views.List.extend({
        _activeDistricts: [],

        initialize: function () {
            this.on('item:click', this._updateDistricts, this);
            REIN.events.on('filter:area', this._clearDistricts, this);
        },

        _clearDistricts: function () {
            this._activeDistricts = [];
        },

        _updateDistricts: function (enable, districtId) {
            if (arguments.length < 2) {
                return this._activeDistricts;
            }
            var districtIndex = _.indexOf(this._activeDistricts, districtId);
            if (enable && districtIndex < 0) {
                this._activeDistricts.push(districtId);
            }
            if (!enable && districtIndex > -1) {
                this._activeDistricts = _.without(this._activeDistricts, districtId);
            }
            REIN.events.trigger('filter:districts', this._activeDistricts);
        }
    });

    L.Models.Mark = Backbone.Model.extend({
        fullName: function () {
            return this.get('firstName') + ' ' + this.get('lastName');
        }
    });

    L.Views.MarkList = REIN.View.extend({
        tagName: 'ul',
        className: 'marks',
        collection: new Backbone.Collection(),
        templates: {
            mark: _.template($('#mark_template').html() || ''),
            svg: _.template($('#svg_template').html() || ''),
            canvas: _.template('<canvas style="width:320px;height:160px;"></canvas>')
        },
        _markViews: [],
        _currentHits: new Backbone.Collection(),

        initialize: function () {
            REIN.events.on('search', this.search, this);
            REIN.events.on('filter:area', this.filterByArea, this);
            REIN.events.on('filter:districts', this.filterByDistricts, this);
            this._currentHits.on('reset', this.render, this);
        },

        render: function () {
            this._clearExistingViews();
            this._currentHits.each(function (owner) {
                var markItem = new L.Views.Mark({
                    model: owner,
                    templates: this.templates
                });
                this.$el.append(markItem.render().el);
                this._markViews.push(markItem);
            }.bind(this));
            return this;
        },

        filterByDistricts: function (districts) {
            this._currentHits.reset(this.collection.filterByDistricts(districts));
        },

        filterByArea: function (areaId) {
            this._clearExistingViews();
        },

        search: function (needle) {
            this._currentHits.reset(this.collection.search(needle));
            if (this._currentHits.length === 0) {
                this.$el.html('<li class="noHits">Ingen treff på søket ditt.</li>');
            }
        },

        empty: function () {
            this._currentHits.reset();
        },

        _clearExistingViews: function () {
            _.each(this._markViews, function(markView) {
                markView.remove();
            });
            this.$el.html('');
        }
    });

    L.Views.Mark = REIN.View.extend({
        className: 'mark',
        tagName: 'li',
        model: new Backbone.Model({}),
        _isOpen: false,
        events: {'click': '_onClick'},

        render: function () {
            var mark = this.model.toJSON(),
                ears = P.ears[mark.cutId],
                districtName = P.Areas[mark.area].districts[mark.district].name,
                svg = this.options.templates.svg({
                    left: ears[0],
                    right: ears[1]
                });
            this.$el.html(this.options.templates.mark({
                districtName: districtName,
                mark: mark
            }));
            if (Modernizr.inlinesvg) {
                this.$('.image').prepend(svg);
            } else {
                this.$('.image').prepend(this.options.templates.canvas());
                canvg(this.$('canvas')[0], svg.trim());
            }
            return this;
        },

        _open: function () {
            this.$('.information').show();
            this.$el.addClass('selected');
            this._isOpen = true;
        },

        _close: function () {
            this.$('.information').hide();
            this.$el.removeClass('selected');
            this._isOpen = false;
        },

        _onClick: function (event) {
            event.preventDefault();
            if (this._isOpen) {
                this._close();
            } else {
                this._open();
            }
        }
    });

    L.Collections.Marks = Backbone.Collection.extend({
        model: L.Models.Mark,

        filterByDistricts: function (districts) {
            return this.filter(function (o) {
                return _.indexOf(districts, o.get('district')) > -1;
            });
        },

        search: function (needle) {
            needle = needle.toLowerCase().trim();
            return this.filter(function (o) {
                return o.fullName().toLowerCase().indexOf(needle) > -1;
            });
        }
    });

}(REINMERKE.module('list'), REINMERKE.module('people'), REINMERKE.module('widget'), REINMERKE));
