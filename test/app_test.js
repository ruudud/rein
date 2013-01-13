(function (REIN) {
  buster.testCase('App', {
    setUp: function () {
      this.baseView = REIN.View.extend({
        initialize: function () {
          this.$el.html([
            '<div class="subviewA"></div>',
            '<div class="subviewB"></div>'
          ].join(''));
        }
      });
    },

    'assign in View': function () {
        var view = new this.baseView(),
          subviewA = new REIN.View(),
          subviewB = new REIN.View();

        view.assign({
          'subviewA': subviewA,
          '.subviewB': subviewB
        });

        assert.equals(subviewA.el, view.$('.subviewA')[0]);
        assert.equals(subviewB.el, view.$('.subviewB')[0]);
    }
  });
}(REIN));
