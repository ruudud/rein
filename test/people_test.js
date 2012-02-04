(function (P) {
    'use strict';
    var assert = buster.assertions.assert, refute = buster.assertions.refute;

    buster.testCase('PeopleModuleTest', {
        'initialization': {
            tearDown: function () {
                localStorage.clear();
                delete localStorage.ReindeerOwners;
            },
            'should fill Owners Collection': function () {
                P.init(true);

                assert(P.Owners.length > 0);
            },
            'backbone should update local storage': function () {
                P.init(true);

                assert(localStorage.getItem('ReindeerOwners'));
            }
        }
    });
}(REINMERKE.module('people')));
