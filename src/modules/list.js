(function (L, P, W, REIN) {

    L.init = function () {
        this.areaList = new L.Views.Areas({collection: P.Areas});
        $('#areas').html(this.areaList.render().el);

        this.navigation = new L.Views.Navigation({el: '#nav'});
        this.markList = new L.Views.MarkList({
            el: '#marks',
            collection: P.register
        });

        REIN.events.on('filter:area', L.showArea, this);
        REIN.events.on('filter:districts', L.showMarksInDistricts, this);
    };

    L.showArea = function (areaId) {
        this.markList.filterOnArea(areaId);
    };

    L.showMarksInDistricts = function (districts) {
        this.markList.render(districts);
    };

    L.Views.Navigation = REIN.View.extend({

        events: {
            'click .toTop': '_onClick'
        },

        _onClick: function () {
            window.scrollTo(0, 1);
        }

    });

    L.Views.Areas = W.Views.List.extend({

        districtList: null,

        initialize: function () {
            this.options.singleElementActive = true;
            this.on('item:click', this._onAreaClick, this);
        },

        _onAreaClick: function (active, id) {
            this.districtList = new L.Views.Districts({collection: this.collection[id].districts});
            $('#districts').html(this.districtList.render().el);
            REIN.events.trigger('filter:area', id);
        }

    });

    L.Views.Districts = W.Views.List.extend({

        _activeDistricts: [],

        initialize: function () {
            this.on('item:click', this._updateDistricts, this);
        },

        _updateDistricts: function (enable, districtId) {
            if (arguments.length < 2) {
                return this._activeDistricts;
            }
            var districtIndex = _.indexOf(this._activeDistricts, districtId);
            if (enable) {
                if (districtIndex < 0) {
                    this._activeDistricts.push(districtId);
                }
            } else {
                if (districtIndex > -1) {
                    this._activeDistricts = _.without(this._activeDistricts, districtId);
                }
            }

            REIN.events.trigger('filter:districts', this._activeDistricts);
        }

    });

    L.Views.MarkList = REIN.View.extend({

        tagName: 'ul',
        className: 'marks',
        collection: new Backbone.Collection.extend({}),
        template: Hogan.compile($('#mark_template').html() || ''),
        _markViews: [],
        _currentCollection: [],

        render: function (districts) {
            this._clearExistingViews();
            var self = this;
            _.chain(this._currentCollection).filter(function (owner) {
                    return _.indexOf(districts, owner.district) > -1;
                }).each(function (owner) {
                    var markItem = new L.Views.Mark({
                        model: owner,
                        template: self.template
                    });
                    self._markViews.push(markItem);
                    self.$el.append(markItem.render().el);
            });
            return this;
        },

        filterOnArea: function (areaId) {
            this._clearExistingViews();
            this._currentCollection = _.filter(this.collection, function (owner) {
                return owner.area === areaId;
            });
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
        events: {
            'click': '_onClick'
        },

        render: function () {
            var districtName = P.Areas[this.model.area]
                .districts[this.model.district].name;
            this.$el.html(this.options.template.render({
                districtName: districtName,
                owner: this.model
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
