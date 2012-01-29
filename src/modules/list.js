(function(L, P) {
    var addOnClick;

    L.init = function() {
        var markList = new L.Views.MarkList({
            collection: P.Owners,
        });
        $('#marks').append(markList.render().el);
    };

    L.Views.MarkList = Backbone.View.extend({

        tagName: 'ul',
        className: 'marks',
        collection: new Backbone.Collection.extend({}),

        initialize: function() {
        },

        render: function() {
            $(this.el).empty();
            var self = this;
            this.collection.each(function(owner) {
                var markItem = new L.Views.Mark({
                    model: owner
                });
                $(self.el).append(markItem.render().el);
            });
            return this;
        }

    });

    L.Views.Mark = Backbone.View.extend({

        className: 'mark',
        tagName: 'li',
        template: $('#mark_template').html() || '',

        model: new Backbone.Model.extend({}),

        _isOpen: false,

        initialize: function() {
            _.bindAll(this, '_onClick');
            addOnClick.call(this.el, this._onClick);
        },

        render: function() {
            $(this.el).html(_.template(this.template, {
                owner: this.model,
                district: P.Districts[this.model.get('district')]
            }));
            return this;
        },

        _onClick: function(event){
            if (this._isOpen) {
                this._closeInformation();
                $(this.el).removeClass('selected');
                this._isOpen = false;
            } else {
                this._openInformation();
                $(this.el).addClass('selected');
                this._isOpen = true;
            }
        },

        _closeInformation: function() {
            this.$('.information').hide();
        },

        _openInformation: function() {
            this.$('.information').show();
        }
    });

    // Utility Functions
    addOnClick = function(func) {
        if (window.Touch) {
            this.addEventListener('touchstart', function(e) {
                e.preventDefault();
                this.moved = false;
                this.addEventListener('touchmove', function() {
                    this.moved = true;
                }, false);
                this.addEventListener('touchend', function() {
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
