(function (L, P, W, REIN) {

    L.init = function () {
        this.loadProgressView = new W.Views.AppCacheProgress();
        $('#appcacheLoader').append(this.loadProgressView.render().el);

        this.search = new L.Views.Search({collection: P.register});
        $('#search').html(this.search.render().el);

        this.areaList = new L.Views.Areas({collection: P.Areas});
        $('#areas').html(this.areaList.render().el);

        this.markList = new L.Views.MarkList({
            collection: P.register
        });
        $('#marks').html(this.markList.render().el);

        this.navigation = new L.Views.Navigation({el: '#nav'});
    };

    L.Views.Navigation = REIN.View.extend({
        events: { 'click .toTop': '_onClick' },
        _onClick: function () { window.scrollTo(0, 1); }
    });

    L.Views.Search = REIN.View.extend({
        events: {'click .search': '_onSearchClick'},

        render: function () {
            this.$el.html(this.template());
            return this;
        },

        _onSearchClick: function () {
            var needle = this.$('input').val();
            REIN.events.trigger('search', needle);
        },

        template: _.template('<input type="text"/><button class="search">Søk</button>')
    });

    L.Views.Areas = W.Views.List.extend({
        districtList: null,

        initialize: function () {
            this.options.singleElementActive = true;
            this.on('item:click', this._onAreaClick, this);
        },

        _onAreaClick: function (active, id) {
            var $districts = $('.districts');
            $districts.css({opacity: 1});
            this.districtList = new L.Views.Districts({collection: this.collection[id].districts});
            $('#districts').html(this.districtList.render().el);
            REIN.events.trigger('filter:area', id);

            //TODO: Make smoother or remove
            window.scrollTo(0, $districts.offset().top);
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
            if (enable  && districtIndex < 0) {
                this._activeDistricts.push(districtId);
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
        template: _.template($('#mark_template').html() || ''),
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
                    template: this.template
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
            needle = needle.toLowerCase();
            this._currentHits.reset(this.collection.filter(function (o) {
                return o.lastName.toLowerCase().indexOf(needle) > -1 ||
                    o.firstName.toLowerCase().indexOf(needle) > -1;
            }));
        },

        _clearExistingViews: function () {
            _.each(this._markViews, function(markView) {
                markView.remove();
            });
        }
    });

    L.Views.Mark = REIN.View.extend({
        className: 'mark',
        tagName: 'li',
        model: new Backbone.Model({}),
        _isOpen: false,
        events: {'click': '_onClick'},

        render: function () {
            var mark = this.model.toJSON();
            var ears = P.ears[mark.cutId];
            var districtName = P.Areas[mark.area].districts[mark.district].name;
            this.$el.html(this.options.template({
                districtName: districtName,
                mark: mark,
                left: ears[0],
                right: ears[1]
            }));
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
}(REINMERKE.module('list'), REINMERKE.module('people'), REINMERKE.module('widget'), REINMERKE));
