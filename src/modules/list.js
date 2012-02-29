(function (L, P, W, E) {

    L.init = function () {
        this.areaList = new L.Views.Areas({collection: P.Areas});
        this.markList = new L.Views.MarkList({collection: P.Owners});
        this.markList.setElement('#marks');

        $('#areas').append(this.areaList.render().el);

        E.on('filter:area', L.showArea, this);
    };

    L.showArea = function (areaId) {
        this.markList.render(areaId);
    };

    L.Views.Areas = W.Views.List.extend({

        initialize: function () {
            this.options.singleElementActive = true;
            this.on('item:click', this._onAreaClick, this);
        },

        _onAreaClick: function (active, id) {
            this.districtList = new L.Views.Districts({collection: this.collection[id].districts});
            $('#districts').html(this.districtList.render().el);
            E.trigger('filter:area', id);
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

            E.trigger('activeDistricts', this._activeDistricts);
        }

    });

    L.Views.MarkList = Backbone.View.extend({

        tagName: 'ul',
        className: 'marks',
        collection: new Backbone.Collection.extend({}),
        template: Hogan.compile($('#mark_template').html() || ''),

        render: function (areaId) {
            var self = this;
            this.collection.chain().filter(function (owner) {
                return owner.get('area') === areaId;
            }).each(function (owner) {
                var markItem = new L.Views.Mark({
                    model: owner,
                    template: self.template
                });
                self.$el.append(markItem.render().el);
            });
            return this;
        }

    });

    L.Views.Mark = Backbone.View.extend({

        className: 'mark',
        tagName: 'li',

        model: new Backbone.Model({}),

        _isOpen: false,
        _visible: false,

        initialize: function () {
            _.bindAll(this, '_onClick');
            this.$el.onpress(this._onClick);

            E.on('activeDistricts', this._toggleVisibility, this);
        },

        render: function () {
            var districtName = P.Areas[this.model.get('area')]
                .districts[this.model.get('district')].name;
            this.$el.html(this.options.template.render({
                districtName: districtName,
                owner: this.model.toJSON()
            }));
            this.show();
            return this;
        },

        show: function () {
            this.$el.show();
            this._visible = true;
        },

        hide: function () {
            this.$el.hide();
            this._visible = false;
        },

        _toggleVisibility: function (activeDistricts) {
            if (activeDistricts.length === 0) {
                this.show();
                return;
            }

            var district = this.model.get('district');
            if (_.indexOf(activeDistricts, district) < 0) {
                if (this._visible) {
                    this.hide();
                }
            } else {
                if (!this._visible) {
                    this.show();
                }
            }
        },

        _onClick: function (event) {
            if (this._isOpen) {
                this._closeInformation();
                this.$el.removeClass('selected');
                this._isOpen = false;
            } else {
                this._openInformation();
                this.$el.addClass('selected');
                this._isOpen = true;
            }
        },

        _closeInformation: function () {
            this.$('.information').hide();
        },

        _openInformation: function () {
            this.$('.information').show();
        }
    });

}(REINMERKE.module('list'), REINMERKE.module('people'), REINMERKE.module('widget'), REINMERKE.events));
