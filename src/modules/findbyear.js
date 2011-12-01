(function(F, P, $) {
    F.init = function() {
        F.cutView = new F.Views.Cuts();
        F.earsView = new F.Views.Ears();
    };

    // Models and Collections
    // The Cut model needs to have both cut type and side=true/false.
    F.Models.Cut = Backbone.Model.extend({ });

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
                name: 'c1'
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
            this.box = {
                x1: offset.left,
                y1: offset.top,
                x2: offset.left + this.el.width(),
                y2: offset.top + this.el.height()
            };
        },

        render: function() {
            this.el.text(this.cuts);
        },

        addCut: function(cut) {
            this.cuts = this.cuts || ''; // FIXME: Collection?
            this.cuts += cut.get('cutType');
        },

        clearCuts: function() {
            this.cuts = '';
            this.render();
        }

    });

    F.Views.Cuts = Backbone.View.extend({
        el: $('#cuts'),

        events: {
            'click .cut': 'cutClick'
        },

        cutClick: function(e) {
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
            'touchstart .draggable': 'move',
            'touchmove .draggable': 'move',
            'touchend .draggable': 'drop',
            'mousemove .draggable': 'move', // Mouse events may be removed
            'mouseup .draggable': 'drop'
        },

        move: function(e) {
            var coordinates, oe = e.originalEvent, clickedEl = e.currentTarget;

            coordinates = {
                top: oe.changedTouches && oe.changedTouches[0].pageY || oe.clientY,
                left: oe.changedTouches && oe.changedTouches[0].pageX || oe.clientX
            };

            $(clickedEl).css(coordinates);
        },

        drop: function(e) {
            var currentPoint, activePart, cutType, searchResult, oe, droppedEl;

            oe = e.originalEvent;
            droppedEl = e.currentTarget;

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
            activePart.render();

            cutType = this.model.get('cutType');
            searchResult = P.Owners.search(activePart.options.name, cutType);

            P.resultsView.update(searchResult);
            P.resultsView.render();

            this.clear();
        },

        locateValidBox: function(cut, point) {
            var sideCut = cut.get('side'), rightEar = F.earsView.rightEar;

            if (sideCut) {
                if (F.isInside(rightEar.side.box, point)) {
                    return rightEar.side;
                }
            }
            else {
                if (F.isInside(rightEar.forward.box, point)) {
                    return rightEar.forward;
                }
                else if (F.isInside(rightEar.back.box, point)) {
                    return rightEar.back;
                }
            }
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
}(REINMERKE.module('drawear'), REINMERKE.module('people'), jQuery));
