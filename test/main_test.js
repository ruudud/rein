(function (M) {
    buster.testCase('Main Module', {
        'loading': {
            setUp: function () {
                this.loadingView = new M.Views.Loading();
                this.loadingSpy = sinon.spy(this.loadingView, '_blockUI');
            },
            'blockUI on loading event': function () {
                REIN.events.trigger('loading:start');
                assert.calledOnce(this.loadingSpy);
                assert.calledWith(this.loadingSpy, true);
            },
            'remove block on loading end event': function () {
                REIN.events.trigger('loading:end');
                assert.calledOnce(this.loadingSpy);
                assert.calledWith(this.loadingSpy, false);
            },
        }
    });
}(REIN.module('main'), REIN));
