(function (L, P) {
    var addOnClick;

    L.init = function () {
        var districtList = new L.Views.Districts({collection: P.Districts});
        var markList = new L.Views.MarkList({collection: P.Owners});
        $('#marks').append(markList.render().el);
        $('#districts').append(districtList.render().el);
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
            'click .filterByDistrict': '_onFilterClick'
        },

        render: function () {
            this.$el.html(this.options.template.render({
                districtName: this.model.get('name')
            }));
            return this;
        },

        _onFilterClick: function (event) {
            event.preventDefault();
            this.$el.toggleClass('selected');
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
            this.$el.empty();
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

        initialize: function () {
            _.bindAll(this, '_onClick');
            addOnClick.call(this.el, this._onClick);
        },

        render: function () {
            var districtName = P.Districts[this.model.get('district')];
            this.$el.html(this.options.template.render({
                districtName: districtName,
                owner: this.model.toJSON()
            }));
            return this;
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

}(REINMERKE.module('list'), REINMERKE.module('people')));
