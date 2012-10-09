/*global Modernizr: true, canvg: true*/
(function (L, W, REIN, $) {

    L.init = function () {
        this.browse = new L.Views.Browse({el: '#browse'});
        this.browse.render();

        this.welcome = new L.Views.Welcome({el: '#welcome'});

        this.topNav = new L.Views.TopNav({el: '#menu'});
        this.bottomNav = new L.Views.BottomNav({el: '#nav'});
        this.markList = new L.Views.MarkList({
            collection: REIN.Register
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

        this.search = new L.Views.Search({collection: REIN.Register, el: '#search'});
        this.search.render();
    };

    L.Views.Welcome = REIN.View.extend({
        events: { 'click .close': '_onClose' },
        initialize: function () {
        },
        _onClose: function (event) {
            event.preventDefault();
            this.$el.hide();
            if (Modernizr.localstorage) {
                localStorage.setItem('welcomeClosed', '1');
            }
        }
    });
    L.Views.TopNav = REIN.View.extend({
        searchActive: false,
        events: { 'click .search': '_onSearchClick' },
        _onSearchClick: function (event) {
            event.preventDefault();
            this.$('.search').toggleClass('active');
            this.searchActive = !this.searchActive;
            REIN.events.trigger('toggleSearch', this.searchActive);
            REIN.tools.trackEvent('nav', 'toggle', 'search');
        }
    });

    L.Views.BottomNav = REIN.View.extend({
        events: { 'click .toTop': '_onClick' },
        _onClick: function () { window.scrollTo(0, 1); }
    });

    L.Views.Search = REIN.View.extend({
        events: {'click .search': '_onSearch'},

        initialize: function () {
            REIN.events.on('toggleSearch', this._onToggleSearch, this);
        },

        render: function () {
            this.$el.append(this.template());
            return this;
        },

        _onSearch: function (event) {
            event.preventDefault();
            var needle = this.$('input').val();
            REIN.events.trigger('search', needle);
            REIN.tools.trackEvent('nav', 'search', needle);
        },

        _onToggleSearch: function () {
            this.$el.toggle();
        },

        template: _.template([
            '<input type="text" placeholder="Navn på eier" class="wide boxed">',
            '<button class="wide button btnText search">Søk</button>',
        ].join('\n'))
    });

    L.Views.Browse = REIN.View.extend({
        initialize: function () {
            this.areas = new L.Views.Areas({collection: REIN.Areas});
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
            this.districtList = new L.Views.Districts({collection: REIN.Areas[id].districts});
            $districts.html('<h2 class="sectionHeader">Velg distrikter</h2>');
            $districts.append(this.districtList.render().el);

            $districts.css({opacity: 1});
            REIN.events.trigger('filter:area', id);

            //TODO: Make smoother or remove
            window.scrollTo(0, $districts.offset().top);
        }
    });

    L.Views.Areas = W.Views.List.extend({
        districtList: null,

        initialize: function () {
            this.options.singleElementActive = true;
            this.on('item:click', this._onAreaClick, this);
        },

        _onAreaClick: function (active, id) {
            this.trigger('area', active, id);
            REIN.tools.trackEvent('nav', 'browseArea', this.collection[id].name);
        }
    });

    L.Views.Districts = W.Views.List.extend({
        _activeDistricts: [],

        initialize: function () {
            this._clearDistricts();
            this.on('item:click', this._updateDistricts, this);
            REIN.events.on('filter:area', this._clearDistricts, this);
        },

        getModel: function (id, item) {
            var model = _.extend({
                id: id,
                count: REIN.Register.filter(function (m) {
                    return m.district === parseInt(id, 10);
                }).length
            }, item);
            return model;
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
                REIN.tools.trackEvent('nav', 'browseDistrict',
                                this.collection[districtId].name);
            }
            if (!enable && districtIndex > -1) {
                this._activeDistricts = _.without(this._activeDistricts, districtId);
            }
            REIN.events.trigger('filter:districts', this._activeDistricts);
        }
    });

    L.Views.MarkList = REIN.View.extend({
        tagName: 'ul',
        className: 'marks',
        collection: new Backbone.Collection(),
        templates: {
            mark: REIN.templates.mark,
            svg: REIN.templates.svg,
            canvas: _.template('<canvas style="width:320px;height:160px;"></canvas>')
        },
        _markViews: [],
        _currentHits: new Backbone.Collection(),

        initialize: function () {
            REIN.events.on('search', this.search, this);
            REIN.events.on('filter:area', this.filterOnArea, this);
            REIN.events.on('filter:districts', this.filterOnDistricts, this);
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

        filterOnDistricts: function (districts) {
            var hits = this.collection.filter(function (o) {
                return _.indexOf(districts, o.district) > -1;
            });
            this._currentHits.reset(hits);
        },

        filterOnArea: function (areaId) {
            this._currentHits.reset(this.collection.filter(function (o) {
                return o.area === areaId;
            }), {silent: true});
            this._clearExistingViews();
        },

        search: function (needle) {
            needle = needle.toLowerCase().trim();
            this._currentHits.reset(this.collection.filter(function (o) {
                var fullName = o.firstName + ' ' + o.lastName;
                return fullName.toLowerCase().indexOf(needle) > -1;
            }));
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
                ears = REIN.Ears[mark.cutId],
                districtName = REIN.Areas[mark.area].districts[mark.district].name,
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
}(REINMERKE.module('list'),  REINMERKE.module('widget'), REINMERKE, $));
