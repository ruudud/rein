(function(E, U, $) {
 
    // Models and Collections
    // The Cut model needs to have both cut type and side=true/false.
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

        events: {
            'click .cut': 'createDraggable'
        },

        createDraggable: function(e) {
            var clickedPos, newCut, clickedEl = e.currentTarget;

            e.originalEvent.preventDefault();

            clickedPos = {
                top: e.changedTouches && e.changedTouches[0].pageY || e.clientY,
                left: e.changedTouches && e.changedTouches[0].pageX || e.clientX
            };

            newCut = new E.Models.Cut({
                'cutType': $(clickedEl).data('type'),
                'cutName': clickedEl.innerHTML,
                'sideCut': $(clickedEl).data('side') || false,
                'cutY': clickedPos.top,
                'cutX': clickedPos.left
            });

            if (E.currentCut) { E.currentCut.clear(); }
            E.currentCut = new E.Views.CurrentCut({
                model: newCut,
                onDrop: this.options.onDrop,
                validDrops: this.options.validDrops
            });
        }
    });

    E.Views.CurrentCut = Backbone.View.extend({
        el: $('#moving_cut'),

        template: $('#moving_cut_template').html() || '',

        clear: function() {
            this.el.unbind();
            this.el.empty();
            delete E.currentCut;
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
            $movingEl = $(e.currentTarget);

            oe.preventDefault();

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

}(REINMERKE.module('ears'), REINMERKE.module('utils'), jQuery));
