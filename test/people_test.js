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
        },
        'filter tests': {
            setUp: function() {
                this.people = new P.Collections.Owners();
                this.people.create({'id': 13, 'c1': 'a'});
                this.people.create({'id': 14, 'c1': 'b'});
            },
            'a on pos1 should only include a-people': function() {
                var matchingIDS = this.people.search('c1', 'a').pluck('id');

                assert.equals(1, matchingIDS.length);
                assert.equals(13, matchingIDS[0]);
            },
            'should filter when pos has two or more cuts': function() {
                var result;
                this.people.create({'id': 15, 'c1': 'ab'});

                result = this.people.search('c1', 'a').pluck('id');

                assert.equals(2, result.length);
                assert.equals(13, result[0]);
                assert.equals(15, result[1]);
            },
            'should filter when cuts includes more cuts in one': function() {
                var result = this.people.search('c1', 'a,c').pluck('id');

                assert.equals(1, result.length);
                assert.equals(13, result[0]);
            },
            'search should be incremental': function() {
                var result;
                this.people.create({'id': 15, 'c1': 'a', 'c3': 'b'});
                this.people.create({'id': 16, 'c1': 'f', 'c3': 'b'});

                result = this.people.search('c1', 'a');

                assert.equals(2, result.length);

                result = this.people.search('c3', 'b').pluck('id');
                assert.equals(1, result.length);
                assert.equals(15, result[0]);
            }
        }
    });
}(REINMERKE.module('people')));
