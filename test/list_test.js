(function (L) {
    'use strict';
    var assert = buster.assertions.assert, refute = buster.assertions.refute;

    buster.testCase('ListModuleTest', {
        'update active districts': {
            tearDown: function () {
                L.clearActiveDistricts();
            },
            'should initially be empty': function () {
                var activeDistricts = L.updateActiveDistricts();
                assert.same(activeDistricts.length, 0);
            },
            'should enable district': function () {
                var activeDistricts = L.updateActiveDistricts(true, 72);
                assert.same(activeDistricts.length, 1);

                activeDistricts = L.updateActiveDistricts(true, 73);
                assert.same(activeDistricts.length, 2);
            },
            'should disable district': function () {
                var activeDistricts = L.updateActiveDistricts(true, 72);
                assert.same(activeDistricts.length, 1);

                activeDistricts = L.updateActiveDistricts(false, 72);
                assert.same(activeDistricts.length, 0);
            }
        }
    });
}(REINMERKE.module('list')));
