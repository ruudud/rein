(function (W, REIN) {

    W.Views.List = REIN.View.extend({
        tagName: 'ul',
        className: 'list',
        collection: {},
        template: Hogan.compile('{{ name }}'),

        render: function () {
            var self = this;
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
            this.$el.html(this.options.template.render({
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

    W.Views.AppCacheProgress = REIN.View.extend({
        className: 'progress',
        template: Hogan.compile('<div class="bar" style="width: {{ progress }}%;"></div>'),
        isVisible: false,
        progress: 0,

        initialize: function () {
            _.bindAll(this, '_onProgressUpdate', '_onCachingComplete');
            window.applicationCache.onprogress = this._onProgressUpdate;
            window.applicationCache.oncached = this._onCachingComplete;
            window.applicationCache.onupdateready = this._onCachingComplete;
        },

        render: function () {
            this.$el.html(this.template.render({progress: this.progress}));
            return this;
        },

        toggle: function () {
            this.$el.toggle();
            this.isVisible = !this.isVisible;
        },

        _onProgressUpdate: function (event) {
            this.progress = (event.loaded / event.total) * 100;
            if (!this.isVisible) {
                this.toggle();
            } else {
                this.$('.bar').css({width: this.progress + '%'});
            }
        },

        _onCachingComplete: function () {
            // TODO: Display information caching complete
            this.remove();
        }
    });

}(REINMERKE.module('widget'), REINMERKE));
