(function (L) {
  buster.testCase('List Module', {
    'active districts': {
      setUp: function () {
        this.districtView = new L.Views.Districts({
          collection: { 13: {'name': 'test'}, 14: {'name': 'test'} }
        });
      },
      tearDown: function () {
        this.districtView.remove();
      },
      'should initially be empty': function () {
        assert.same(-1, this.districtView.activeDistrict);
      },
      'should enable on click event': function () {
        this.districtView.trigger('item:click', 13);

        assert.same(this.districtView.activeDistrict, 13);
      }
    }
  });
}(REIN.module('list')));
