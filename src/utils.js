// Polyfills
''.trim||(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,'');});
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }
    var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, FNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof FNOP ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
        };
    FNOP.prototype = this.prototype;
    fBound.prototype = new FNOP();

    return fBound;
  };
}

REIN.tools = {
    trackEvent: function (category, action, opt_label, opt_value) {
        window._gaq && window._gaq.push(['_trackEvent', category, action, opt_label, opt_value]);
    },

    trackPageView: function (url) {
        window._gaq && window._gaq.push(['_trackPageview', url]);
    }
};
