(function (L) {
    'use strict';
    var assert = buster.assertions.assert, refute = buster.assertions.refute;

    buster.assertions.add('contains', {
        assert: function (needle, haystack) {
            return _.indexOf(needle, haystack) > -1;
        },
        assertMessage: 'Expected ${1} to be in the list'
    });

    buster.testCase('List Module', {
        'active districts': {
            setUp: function () {
                this.districtView = new L.Views.Districts({});
            },
            tearDown: function () {
                this.districtView.remove();
            },
            'should initially be empty': function () {
                assert.equals(0, this.districtView._activeDistricts.length);
            },
            'should enable on click event': function () {
                this.districtView.trigger('item:click', true, 13);
                this.districtView.trigger('item:click', true, 14);

                assert.contains(this.districtView._activeDistricts, 13);
                assert.contains(this.districtView._activeDistricts, 14);
            },
            'should disable on click event': function () {
                this.districtView.trigger('item:click', true, 13);
                this.districtView.trigger('item:click', true, 14);
                this.districtView.trigger('item:click', false, 14);

                assert.contains(this.districtView._activeDistricts, 13);
                refute.contains(this.districtView._activeDistricts, 14);
            }
        }
    });
}(REINMERKE.module('list')));
