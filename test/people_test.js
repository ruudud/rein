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
        },
        'filter owners': {
            setUp: function () {
                this.collection = new P.Collections.Owners();
                this.collection.create({
                    district: 72,
                    firstName: 'Anna A.',
                    lastName: 'Stenfjell',
                });
                this.collection.create({
                    district: 72,
                    firstName: 'Sindre Fjelner Danielsen',
                    lastName: 'Gundersen',
                });
                this.collection.create({
                    district: 73,
                    firstName: 'Silje Helen Danielsen',
                    lastName: 'Gundersen',
                });
                this.collection.create({
                    district: 74,
                    firstName: 'Silje Helen Danielsen',
                    lastName: 'Gundersen',
                });
            },
            tearDown: function () {
                localStorage.clear();
                delete localStorage.ReindeerOwners;
            },
            'by district should return all when no arguments given': function () {
                var filteredOwners = this.collection.filterByDistrict();
                assert.same(filteredOwners.length, 4);
            },
            'by district should return only matches': function () {
                var filteredOwners = this.collection.filterByDistrict(true, 72);
                assert.same(filteredOwners.length, 2);
            },
            'by district should incrementally filter': function () {
                this.collection.filterByDistrict(true, 72);
                var filteredOwners = this.collection.filterByDistrict(true, 73);
                assert.same(filteredOwners.length, 3);
            },
            'by district should update filter when disable': function () {
                this.collection.filterByDistrict(true, 72);
                this.collection.filterByDistrict(true, 73);
                var filteredOwners = this.collection.filterByDistrict(false, 72);
                assert.same(filteredOwners.length, 1);
            }
        }
    });
}(REINMERKE.module('people')));
