/*global Modernizr: true, canvg: true*/
(function (L, W, REIN, $) {
    L.Views.Browse = REIN.View.extend({
        subviews: {
            search: null,
            browse: null,
            areas: null,
            districts: null
        },
        districts: null,

        initialize: function () {
            this.areas = new L.Views.Areas({collection: REIN.Areas});
            this.areas.on('area', this._onBrowseArea, this);
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
            this.districts && this.districts.remove();
        },

        hide: function () {
            this.$el.hide();
        },

        show: function () {
            this.$el.show();
        },

        _onBrowseArea: function (id) {
            var $districts = this.$('.districts');
            this.districts = new L.Views.Districts({
                collection: REIN.Areas[id].districts
            });
            $districts.html('<h2 class="sectionHeader">Velg distrikter</h2>');
            $districts.append(this.districts.render().el);

            $districts.css({opacity: 1});
            REIN.events.trigger('filter:area', id);

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
        initialize: function () {
            this.on('item:click', this._onAreaClick, this);
        },

        _onAreaClick: function (id) {
            this.trigger('area', id);
            REIN.tools.trackEvent('nav', 'browseArea', this.collection[id].name);
        }
    });

    L.Views.Districts = W.Views.List.extend({
        activeDistrict: -1,

        initialize: function () {
            this.on('item:click', this._onDistrictClick, this);
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

        _onDistrictClick: function (districtId) {
            this.activeDistrict = districtId;
            REIN.events.trigger('filter:districts', [districtId]);
            REIN.tools.trackEvent('nav', 'browseDistrict',
                                  this.collection[districtId].name);
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
        _currentHits: new Backbone.Collection(),

        initialize: function () {
            REIN.events.onMultiple({
                'toggleSearch'    : this._onToggleSearch,
                'search'          : this.search,
                'filter:area'     : this.filterOnArea,
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
            }.bind(this));
            window.scrollTo(0, this.$el.offset().top);
            REIN.events.trigger('loading:end');
            return this;
        },

        filterOnArea: function (areaId) {
            var hits = this.collection.filter(function (o) {
                return o.area === areaId;
            });
            this._currentHits.reset(hits, {silent: true});
            this._clearExistingViews();
        },

        filterOnDistricts: function (districts) {
            REIN.events.trigger('loading:start');
            var hits = this.collection.filter(function (o) {
                return _.indexOf(districts, o.district) > -1;
            });
            // Need to delay by 200ms to ensure animation start
            REIN.tools.defer(this._currentHits, 'reset', 200, hits);
        },

        search: function (needle) {
            var hits, tElapsed, tPerChar, tBefore = +(new Date());
            REIN.events.trigger('loading:start');

            needle = needle.toLowerCase().trim();
            hits = this.collection.filter(function (o) {
                var fullName = o.firstName + ' ' + o.lastName;
                return fullName.toLowerCase().indexOf(needle) > -1;
            });
            REIN.tools.defer(this._currentHits, 'reset', 200, hits);

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
            this.$el.empty();
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
