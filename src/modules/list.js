/*global Modernizr: true, canvg: true*/
(function (L, W, REIN, $) {
    L.Views.Browse = REIN.View.extend({
        initialize: function () {
            this.areas = new L.Views.Areas({collection: REIN.Areas});
            this.areas.on('area', this._onBrowseArea, this);
            this.districtList = new L.Views.Districts();
            REIN.events.on('toggleSearch', this._onToggleSearch, this);
            REIN.events.on('search', this._onSearch, this);
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
        },

        _onSearch: function () {
            this.hide();
            this.reset();
        },

        _onToggleSearch: function (active) {
            if (!active) {
                this.show();
            }
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
            canvas: REIN.templates.canvas
        },
        _markViews: [],
        _currentHits: new Backbone.Collection(),

        initialize: function () {
            REIN.events.onMultiple({
                'toggleSearch': this._onToggleSearch,
                'search': this.search,
                'filter:area': this.filterOnArea,
                'filter:districts': this.filterOnDistricts
            }, this);
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
            var tElapsed, tPerChar, tBefore = +(new Date());

            needle = needle.toLowerCase().trim();
            this._currentHits.reset(this.collection.filter(function (o) {
                var fullName = o.firstName + ' ' + o.lastName;
                return fullName.toLowerCase().indexOf(needle) > -1;
            }));

            tElapsed = +(new Date()) - tBefore;
            tPerChar = tElapsed / needle.length;
            REIN.tools.trackEvent('time', 'search', tPerChar);

            if (this._currentHits.length === 0) {
                this.$el.html('<li class="noHits">Ingen treff på søket ditt.</li>');
            }
        },

        empty: function () {
            this._currentHits.reset();
        },

        _onToggleSearch: function (active) {
            if (!active) {
                this.empty();
            }
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
                this.$('.image').append(svg);
            } else {
                this.renderSvgInCanvas(svg);
            }
            return this;
        },

        renderSvgInCanvas: function (svg) {
            this.$('.image').prepend(this.options.templates.canvas());
            // canvg requires fixed width and height to scale correctly:
            // http://code.google.com/p/canvg/issues/detail?id=74
            var $canvas = this.$('canvas'),
                viewPortWidth = $(window).width(),
                canvasWidth = viewPortWidth > 320 ? 320 : viewPortWidth,
                canvasHeight = canvasWidth * 0.35;

            $canvas.width(canvasWidth + 'px').height(canvasHeight + 'px');
            canvg($canvas[0], svg.trim(), {
                ignoreMouse: true,
                ignoreDimensions: true,
                scaleWidth: canvasWidth
            });
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
}(REIN.module('list'), REIN.module('widget'), REIN, $));
