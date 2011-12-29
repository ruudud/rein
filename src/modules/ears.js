(function(E, U, $) {
 
    // Models and Collections
    E.Models.Cut = Backbone.Model.extend({ });

    E.Collections.Cuts = Backbone.Collection.extend({
        model: E.Models.Cut
    });

    
    // Views
    E.Views.Ears = Backbone.View.extend({
        el: $('#ears'),

        initialize: function() {
            this.rightEar= new E.Views.Ear({el: $('#right_ear')});
            //this.leftEar= new E.Views.Ear({el: $('#left_ear')});
        },

        clearCuts: function() {
            this.rightEar.clearCuts();
        }
    });

    E.Views.Ear = Backbone.View.extend({
        initialize: function() {
            this.front = new E.Views.EarPart({
                el: this.$('.front'),
                name: 'c1',
            });
            this.side = new E.Views.EarPart({
                el: this.$('.side'),
                name: 'c2'
            });
            this.back = new E.Views.EarPart({
                el: this.$('.back'),
                name: 'c3'
            });
        },

        clearCuts: function() {
            this.front.clearCuts();
            this.side.clearCuts();
            this.back.clearCuts();
        },
    });

    E.Views.EarPart = Backbone.View.extend({
        initialize: function() {
            var offset = this.el.offset() || {};
            this.coordinates = {
                x1: offset.left,
                y1: offset.top,
                x2: offset.left + this.el.width(),
                y2: offset.top + this.el.height()
            };
            this.downRightPoint = {
                x: this.el.width(),
                y: this.el.height()
            };
            this.cuts = new E.Collections.Cuts();
            this.ctx = this._setupCanvas();
            this._canvasContentLength = 0;
        },

        isFront: function() {
            return _.indexOf(['c1', 'c6'], this.options.name) >= 0;
        },

        isBack: function() {
            return _.indexOf(['c3', 'c4'], this.options.name) >= 0;
        },

        isSide: function() {
            return _.indexOf(['c2', 'c5'], this.options.name) >= 0;
        },

        isRight: function() {
            return _.indexOf(['c1', 'c2', 'c3'], this.options.name) >= 0;
        },

        isLeft: function() {
            return _.indexOf(['c4', 'c5', 'c6'], this.options.name) >= 0;
        },

        addText: function(text) {
            var offsetY = this.cuts.length * 10 + 11;
            this.ctx.fillText(text, 2, offsetY);
        },

        canvasContentLength: function(value) {
            if (typeof(value) !== 'undefined') {
                this._canvasContentLength = value;
            }
            return this._canvasContentLength;
        },

        clearCuts: function() {
            this.cuts.reset();
            this.ctx.clearRect(0, 0, this.downRightPoint.x,
                               this.downRightPoint.y);
            this.ctx.save();
            this.canvasContentLength(0);
        },

        _setupCanvas: function() {
            var cvs, ctx;
            cvs = this.$('canvas').length > 0 && this.$('canvas')[0];
            ctx = cvs && cvs.getContext('2d');
            this._copyWidthAndHeight(cvs, this.el);
            this._copyWidthAndHeight(ctx, this.el);
            ctx.fillStyle = '#FFFFFF';
            return ctx;
        },

        _copyWidthAndHeight: function(el, $baseEl) {
            el.width = $baseEl.width();
            el.height = $baseEl.height();
        }
    });

    E.Views.Cuts = Backbone.View.extend({
        el: $('#cuts'),

        _viewsOfCuts: [],

        initialize: function() {
            var that = this;
            this.collection.each(function(model) {
                var newCut = new E.Views.Cut({
                    model: model,
                    onDrop: that.options.onDrop,
                    validDrops: that.options.validDrops
                });
                newCut.render();
                that._viewsOfCuts.push(newCut);
            });
            this.render();
        },


        render: function() {
            var that = this;
            _.each(this._viewsOfCuts, function(view) {
                that.el.append(view.el);
            });
        }
    });

    E.Views.Cut = Backbone.View.extend({
        className: 'cut',

        events: {
            'click': '_createDraggable'
        },

        render: function(){
            $(this.el).text(this.model.get('name'));
        },

        _createDraggable: function(e) {
            var clickedPos, newCut;

            e.originalEvent.preventDefault();

            clickedPos = {
                top: e.changedTouches && e.changedTouches[0].pageY || e.clientY,
                left: e.changedTouches && e.changedTouches[0].pageX || e.clientX
            };

            newCut = new E.Models.Cut({
                'cutType': this.model.get('id'),
                'cutName': this.model.get('name'),
                'cutY': clickedPos.top,
                'cutX': clickedPos.left
            });

            if (E.movingCut) { E.movingCut.clear(); }
            E.movingCut = new E.Views.MovingCut({
                model: newCut,
                onDrop: this.options.onDrop,
                validDrops: this.options.validDrops
            });
        },
    });

    E.Views.MovingCut = Backbone.View.extend({
        el: $('#moving_cut'),

        template: $('#moving_cut_template').html() || '',

        clear: function() {
            this.el.unbind();
            this.el.empty();
            delete E.movingCut;
        },

        render: function() {
            var renderedTemplate = _.template(this.template,
                                              this.model.toJSON());
            this.el.append(renderedTemplate);
        },

        initialize: function() {
            this.render();
        },

        events: {
            'touchstart .draggable': 'start',
            'touchmove .draggable': 'move',
            'touchend .draggable': 'drop',
            'mousemove .draggable': 'move', // Mouse events may be removed
            'mouseup .draggable': 'drop'
        },

        start: function(e) {
            var oe = e.originalEvent;
            if (oe.changedTouches) {
                this.dragging = true;
            }
        },
        move: function(e) {
            var coordinates, left, right, oe, $movingEl, touch;

            oe = e.originalEvent;
            oe.preventDefault();
            $movingEl = this.$('.draggable');

            if (oe.targetTouches) {
                touch = oe.targetTouches[0]; // One finger is enough
                coordinates = {
                    top: (touch.pageY - (parseInt($movingEl.css('height'), 10) / 2)),
                    left: (touch.pageX - (parseInt($movingEl.css('width'), 10) / 2))
                };
                if (this.dragging) {
                    $movingEl.css(coordinates);
                }
            }
            else {
                coordinates = {
                    top: oe.clientY,
                    left: oe.clientX
                };
                $movingEl.css(coordinates);
            }
        },

        drop: function(e) {
            var currentPoint, droppedBox, oe = e.originalEvent;

            this.dragging = false;

            currentPoint = {
                y: oe.changedTouches && oe.changedTouches[0].pageY || oe.clientY,
                x: oe.changedTouches && oe.changedTouches[0].pageX || oe.clientX
            };

            droppedBox = this.locateValidBox(currentPoint, this.options.validDrops);
            if (typeof droppedBox === 'undefined') {
                this.clear();
                return;
            }

            this.clear();
            this.options.onDrop(droppedBox, this.model);
        },

        locateValidBox: function(point, validDrops) {
            var i, insideBox;
            for (i = 0; i < validDrops.length; i = i + 1) {
                if (U.isInside(validDrops[i].coordinates, point)) {
                    insideBox = validDrops[i];
                    break;
                }
            }
            return insideBox;
        }
    });

    E.SouthSamiCuts = function() {
        return new E.Collections.Cuts([
            {name: 'tjiehkie', id: 'a,b'},
            {name: 'govre', id: 'c'},
            {name: 'voelese', id: 'd'},
            {name: 'vitnjeluktie åvtelde', id: 'e'},
            {name: 'vitnjeluktie minngelde', id: 'f'},
            {name: 'saerkie', id: 'g'},
            {name: 'raejkie', id: 'k'},
            {name: 'skaajte åvtelde', id: 'l'},
            {name: 'kruehkie åvtelde', id: 'n'},
            {name: 'tjiehkie vuelege', id: 'x'},
            {name: 'jarpe', id: 'z'},
            {name: 'tjiehkie saerkie', id: 'y'}
        ]);
    };

}(REINMERKE.module('ears'), REINMERKE.module('utils'), jQuery));
