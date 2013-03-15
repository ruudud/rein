// Polyfills
''.trim||(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,'');});
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== 'function') {
      throw new TypeError('What is trying to be bound is not callable');
    }
    var aArgs = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      FNOP = function () {},
      fBound = function () {
        return fToBind.apply(this instanceof FNOP ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
      };
    FNOP.prototype = this.prototype;
    fBound.prototype = new FNOP();

    return fBound;
  };
}

REIN.tools = {
  debug: function (firstText) {
    var $debug = $('<section class="debug"/>'),
      template = _.template('<div><%= t %></div>'),
      debugFn = function (text) {
        $debug.append(template({t: text}));
      };
    $('body').append($debug);
    debugFn(firstText);
    return debugFn;
  },

  defer: function (object, method, delay) {
    var args = Array.prototype.slice.call(arguments, 3),
      fnBind = function () {
        object[method].apply(object, args);
      };
    setTimeout(fnBind, delay);
  },

  trackEvent: function (event, properties) { // (category, action, opt_label, opt_value) {
    window.mixpanel && window.mixpanel.track(event, properties);
    if (window._gaq) {
      var category = (properties && properties.category) || 'All',
          label = (properties && properties.label) || '';
      window._gaq.push([ '_trackEvent', category, event, label ]);
    }
  },

  trackPageView: function (url) {
    window._gaq && window._gaq.push(['_trackPageview', url]);
  }
};
