(function (W, REIN) {

    W.Views.List = REIN.View.extend({
        tagName: 'ul',
        className: 'list',
        _listItems: [],
        collection: {},
        template: _.template('<%= name %><br><span class="subText"></span><i class="follow">❯</i>'),

        render: function () {
            _.each(this.collection, function (item, id) {
                var listItem = new W.Views.ListItem(_.extend(this.options, {
                    app: this,
                    model: new Backbone.Model({id: id, name: item.name}),
                    template: this.template
                }));
                this.$el.append(listItem.render().el);
                this._listItems.push(listItem);
            }.bind(this));
            return this;
        },

        reset: function () {
            this.$('.selected').removeClass('selected');
            _.each(this._listItems, function (item) {
                item.reset();
            });
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

        reset: function () {
            this._active = false;
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
