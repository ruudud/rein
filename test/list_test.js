(function (L) {
    'use strict';
    var assert = buster.assertions.assert, refute = buster.assertions.refute;

    buster.testCase('ListModuleTest', {
        'update active districts': {
            'should initially be empty': function () {
                var activeDistricts = L.updateActiveDistricts();
                assert.same(activeDistricts.length, 0);
            },
        }
    });
}(REINMERKE.module('list')));
