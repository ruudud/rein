Zepto(function($) {
    REINMERKE.module('people').init();
    REINMERKE.module('list').init();

    window.scrollTo(0, 1);
});

Object.prototype.addOnClick = function(func) {
    if (window.Touch) {
        this.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.moved = false;
            this.addEventListener('touchmove', function() {
                this.moved = true;
            }, false);
            this.addEventListener('touchend', function() {
                this.removeEventListener('touchmove', this, false);
                this.removeEventListener('touchend', this, false);
                if (!this.moved) {
                    func();
                }
            }, false);

        }, false);
    } else {
        this.onclick = func;
    }
};
