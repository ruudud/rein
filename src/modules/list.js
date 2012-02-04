(function (L, P, E) {
    var addOnClick, districtList, markList,
        _activeDistricts = [];

    L.init = function () {
        this.districtList = new L.Views.Districts({collection: P.Districts});
        this.markList = new L.Views.MarkList({collection: P.Owners});
        $('#districts').append(this.districtList.render().el);
        $('#marks').append(this.markList.render().el);

        E.on('filter:district', L.updateActiveDistricts, this);
    };

    L.updateActiveDistricts = function (enable, districtId) {
        if (arguments.length < 2) {
            return _activeDistricts;
        }
        var districtIndex = _.indexOf(_activeDistricts, districtId);
        if (enable) {
            if (districtIndex < 0) {
                _activeDistricts.push(districtId);
            }
        } else {
            if (districtIndex > -1) {
                _activeDistricts = _.without(_activeDistricts, districtId);
            }
        }
        E.trigger('activeDistricts', _activeDistricts);
        return _activeDistricts;
    };

    L.Views.Districts = Backbone.View.extend({

        tagName: 'ul',
        className: 'districts',
        collection: {},
        template: Hogan.compile($('#district_template').html() || ''),

        render: function () {
            this.$el.empty();
            var self = this;
            _.each(this.collection, function (districtName, id) {
                var district = new L.Views.District({
                    model: new Backbone.Model({id: id, name: districtName}),
                    template: self.template
                });
                self.$el.append(district.render().el);
            });
            return this;
        }

    });

    L.Views.District = Backbone.View.extend({

        tagName: 'li',
        className: 'district',
        events: {
            'click': '_onFilterClick'
        },
        _active: false,

        render: function () {
            this.$el.html(this.options.template.render({
                districtName: this.model.get('name')
            }));
            return this;
        },

        _onFilterClick: function (event) {
            event.preventDefault();
            this.$el.toggleClass('selected');
            if (this._active) {
                this._active = false;
                E.trigger('filter:district', false, parseInt(this.model.get('id')));
            } else {
                this._active = true;
                E.trigger('filter:district', true, parseInt(this.model.get('id')));
            }
        }

    });

    L.Views.MarkList = Backbone.View.extend({

        tagName: 'ul',
        className: 'marks',
        collection: new Backbone.Collection.extend({}),
        template: Hogan.compile($('#mark_template').html() || ''),

        initialize: function () {
        },

        render: function () {
            var self = this;
            this.collection.each(function (owner) {
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
            addOnClick.call(this.el, this._onClick);

            E.on('activeDistricts', this._toggleVisibility, this);
        },

        render: function () {
            var districtName = P.Districts[this.model.get('district')];
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

    // Utility function s
    addOnClick = function (func) {
        if (window.Touch) {
            this.addEventListener('touchstart', function (e) {
                e.preventDefault();
                this.moved = false;
                this.addEventListener('touchmove', function () {
                    this.moved = true;
                }, false);
                this.addEventListener('touchend', function () {
                    this.removeEventListener('touchmove', this, false);
                    this.removeEventListener('touchend', this, false);
                    if (!this.moved) {
                        func();
                    }
                }, false);

            }, false);
        } else {
            this.onclick = func;
        }
    };

}(REINMERKE.module('list'), REINMERKE.module('people'), REINMERKE.events));
