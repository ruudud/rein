(function(P) {
    'use strict';
    var assert = buster.assert, refute = buster.refute;

    buster.testCase('PeopleModuleTest', {
        'initialization tests': {
            'init should fill Owners Collection': function() {
                P.init(true);

                assert(P.Owners.length > 0);
            },
            'backbone should update local storage': function() {
                P.init(true);

                assert(localStorage.getItem('ReindeerOwners'));
            }
        }
    });
}(REINMERKE.module('people')));
