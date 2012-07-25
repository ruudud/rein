(function (W, REIN) {

    W.Views.List = REIN.View.extend({
        tagName: 'ul',
        className: 'list',
        collection: new Backbone.Collection(),
        itemTemplate: _.template('<%= name %>'),

        render: function () {
            _.each(this.collection, function (item, id) {
                var listItem = new W.Views.ListItem(_.extend(this.options, {
                    app: this,
                    model: new Backbone.Model({id: id, name: item.name}),
                    template: this.itemTemplate
                }));
                this.$el.append(listItem.render().el);
            }.bind(this));
            return this;
        }
    });

    W.Views.ListItem = REIN.View.extend({
        tagName: 'li',
        className: 'item',
        _active: false,
        _defaultOptions: {
            singleElementActive: false
        },
        events: {
            'click': '_onClick'
        },

        initialize: function () {
            this.options = _.defaults(this.options, this._defaultOptions);
        },

        render: function () {
            this.$el.html(this.options.template({
                name: this.model.get('name')
            }));
            return this;
        },

        _onClick: function (event) {
            event.preventDefault();
            if (this.options.singleElementActive) {
                this.$el.addClass('selected').siblings('.selected').removeClass('selected');
                this.options.app.trigger('item:click', true, parseInt(this.model.get('id'), 10));
                return;
            }
            this.$el.toggleClass('selected');
            if (this._active) {
                this.options.app.trigger('item:click', false, parseInt(this.model.get('id'), 10));
                this._active = false;
            } else {
                this.options.app.trigger('item:click', true, parseInt(this.model.get('id'), 10));
                this._active = true;
            }
        }
    });

}(REINMERKE.module('widget'), REINMERKE));
