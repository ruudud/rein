(function(U, $) {
    'use strict';
    var assert = buster.assert, refute = buster.refute;

    buster.testCase('DrawEarModuleTest', {
        'isInside': {
            setUp: function() {
                this.box = {x1: 5, y1: 5, x2: 10, y2: 10};
            },
            'should return false if over': function() {
                assert.isFalse(U.isInside(this.box, {x: 5, y: 4}));
            },
            'should return false if under': function() {
                assert.isFalse(U.isInside(this.box, {x: 5, y: 11}));
            },
            'should return false if on left side': function() {
                assert.isFalse(U.isInside(this.box, {x: 4, y: 5}));
            },
            'should return false if on right side': function() {
                assert.isFalse(U.isInside(this.box, {x: 11, y: 5}));
            },
            'should return true if inside': function() {
                assert.isTrue(U.isInside(this.box, {x: 6, y: 7}));
            },
            'should return true if on the edge': function() {
                assert.isTrue(U.isInside(this.box, {x: 5, y: 5}));
            }
        }
    });
}(REINMERKE.module('utils'), jQuery));
