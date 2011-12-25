(function(F, P, PA, $) {
    F.init = function() {
        F.cutView = new F.Views.Cuts();
        F.earsView = new F.Views.Ears();
    };

    // Models and Collections
    // The Cut model needs to have both cut type and side=true/false.
    F.Models.Cut = Backbone.Model.extend({ });

    F.Collections.Cuts = Backbone.Collection.extend({
        model: F.Models.Cut
    });

    F.Views.Ears = Backbone.View.extend({
        el: $('#ears'),

        events: {
            'click .reset': 'resetSearch'
        },

        initialize: function() {
            this.rightEar= new F.Views.Ear({el: $('#right_ear')});
            //this.leftEar= new F.Views.Ear({el: $('#left_ear')});
        },

        resetSearch: function() {
            this.clearCuts();
            P.Owners.resetSearch();
        },

        clearCuts: function() {
            this.rightEar.clearCuts();
        }

    });

    // Views
    F.Views.Ear = Backbone.View.extend({
        initialize: function() {
            this.forward = new F.Views.EarPart({
                el: this.$('.forward'),
                name: 'c1',
            });
            this.side = new F.Views.EarPart({
                el: this.$('.side'),
                name: 'c2'
            });
            this.back = new F.Views.EarPart({
                el: this.$('.back'),
                name: 'c3'
            });
        },

        clearCuts: function() {
            this.forward.clearCuts();
            this.side.clearCuts();
            this.back.clearCuts();
        },
    });

    F.Views.EarPart = Backbone.View.extend({
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
            this.cuts = new F.Collections.Cuts();
            this.ctx = this._setupCanvas();
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

        addCut: function(cut) {
            PA.draw(cut, this);
            this.cuts.add(cut); 
        },

        addText: function(text) {
            var offsetY = this.cuts.length * 10 + 11;
            this.ctx.fillText(text, 0, offsetY);
        },

        clearCuts: function() {
            this.cuts.reset();
            this.ctx.clearRect(0, 0, this.downRightPoint.x,
                               this.downRightPoint.y);
            this.ctx.save();
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

    F.Views.Cuts = Backbone.View.extend({
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

            newCut = new F.Models.Cut({
                'cutType': $(clickedEl).data('type'),
                'cutName': clickedEl.innerHTML,
                'sideCut': $(clickedEl).data('side') || false,
                'cutY': clickedPos.top,
                'cutX': clickedPos.left
            });

            if (F.currentCut) { F.currentCut.clear(); }
            F.currentCut = new F.Views.CurrentCut({model: newCut});
        }
    });

    F.Views.CurrentCut = Backbone.View.extend({
        el: $('#moving_cut'),

        template: $('#moving_cut_template').html() || '',

        clear: function() {
            this.el.unbind();
            this.el.empty();
            delete F.currentCut;
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
            var currentPoint, activePart, oe = e.originalEvent;

            this.dragging = false;

            currentPoint = {
                y: oe.changedTouches && oe.changedTouches[0].pageY || oe.clientY,
                x: oe.changedTouches && oe.changedTouches[0].pageX || oe.clientX
            };

            activePart = this.locateValidBox(this.model, currentPoint);
            if (typeof activePart === 'undefined') {
                this.clear();
                return;
            }

            activePart.addCut(this.model);
            this._updateSearch(activePart.options.name, activePart.cuts);

            this.clear();
        },

        locateValidBox: function(cut, point) {
            var sideCut = cut.get('side'), rightEar = F.earsView.rightEar;

            if (sideCut) {
                if (F.isInside(rightEar.side.coordinates, point)) {
                    return rightEar.side;
                }
            }
            else {
                if (F.isInside(rightEar.forward.coordinates, point)) {
                    return rightEar.forward;
                }
                else if (F.isInside(rightEar.back.coordinates, point)) {
                    return rightEar.back;
                }
            }
        },

        _updateSearch: function(partName, cuts) {
            var searchResult = P.Owners.search(partName, cuts);
            P.resultsView.update(searchResult);
            P.resultsView.render();
        }
    });


    // Utility functionality
    // ----------------------

    F.isInside = function(box, point) {
        if (point.y < box.y1 || point.y > box.y2) {
            return false;
        }
        else if (point.x < box.x1 || point.x > box.x2) {
            return false;
        }
        return true;
    };
}(REINMERKE.module('findbyear'), REINMERKE.module('people'), REINMERKE.module('painter'), jQuery));
