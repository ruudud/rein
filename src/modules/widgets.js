(function (W) {

    W.Views.List = Backbone.View.extend({

        tagName: 'ul',
        className: 'list',
        collection: {},
        template: Hogan.compile('<a href="#">{{ name }}</a>'),

        render: function () {
            var self = this;
            this.$el.empty();
            _.each(this.collection, function (item, id) {
                var listItem = new W.Views.ListItem(_.extend(self.options, {
                    app: self,
                    model: new Backbone.Model({id: id, name: item.name}),
                    template: self.template
                }));
                self.$el.append(listItem.render().el);
            });
            return this;
        }

    });

    W.Views.ListItem = Backbone.View.extend({

        tagName: 'li',
        className: 'item',
        events: {
            'click': '_onClick'
        },
        _active: false,
        _defaultOptions: {
            singleElementActive: false
        },

        initialize: function () {
            this.options = _.defaults(this.options, this._defaultOptions);
        },

        render: function () {
            this.$el.html(this.options.template.render({
                name: this.model.get('name')
            }));
            return this;
        },

        _onClick: function (event) {
            event.preventDefault();
            if (this.options.singleElementActive) {
                this.options.app.trigger('item:click', true, parseInt(this.model.get('id'), 10));
                this.$el.addClass('selected').siblings('.selected').removeClass('selected');
                return;
            }
            this.$el.toggleClass('selected');
            if (this._active) {
                this._active = false;
                this.options.app.trigger('item:click', false, parseInt(this.model.get('id'), 10));
            } else {
                this._active = true;
                this.options.app.trigger('item:click', true, parseInt(this.model.get('id'), 10));
            }
        }

    });
}(REINMERKE.module('widget')));
