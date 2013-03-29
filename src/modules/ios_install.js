(function (M, REIN, $, window) {

  var _getIOSVersion, _createBalloon;

  _getIOSVersion = function () {
    var OSVersion = window.navigator.appVersion.match(/OS (\d+_\d+)/i);
    return OSVersion && OSVersion[1] ? +OSVersion[1].replace('_', '.') : 0;
  };

  _createBalloon = function () {
    var startY = 0, startX = 0, bottomOffset = 14, context = {}, styles = {},
      iPadXShift = 208, ver = _getIOSVersion();

    context.classes = $.os.ipad ? 'addToHomeIpad' : 'addToHomeIphone';
    context.icon = ver >= 4.2 ? 'addToHomeShare' : 'addToHomePlus';

    styles.position = ver < 5 ? 'absolute' : 'fixed';

    if ($.os.ipad) {
        if (ver < 5) {
          startY = window.scrollY;
          startX = window.scrollX;
        } else if (ver < 6) {
          iPadXShift = 160;
        }
        styles.top = startY + bottomOffset + 'px';
        styles.left = startX + iPadXShift - 134 + 'px';
    } else {
      startY = window.innerHeight + window.scrollY;
      if ( ver < 5 ) {
        startX = Math.round((window.innerWidth - 240) / 2) + window.scrollX;
        styles.left = startX + 'px';
        styles.top = startY - 66 - bottomOffset + 'px';
      } else {
        styles.left = '50%';
        styles.bottom = bottomOffset + 'px';
        styles['margin-left'] = '-120px';
      }
    }

    context.styles = _.reduce(styles, function (memo, val, key) {
      return memo + key + ':' + val + ';';
    }, '');

    return REIN.templates.installBubble(context);
  };

  M.install = function () {
    $('body')
      .addClass('loading')
      .show()
      .html(REIN.templates.install())
      .append(_createBalloon());

    _.delay(function () {
      $('#addToHomeScreen').css({ opacity: 1 });
    }, 2000);

    REIN.tools.trackEvent('iphone_install start');
  };

  M.isInstalled = function () {
    if ($.os && $.os.ios && !($.browser && $.browser.chrome)) {
      if (!window.navigator.standalone) {
        return false;
      } else {
        REIN.tools.trackEvent('iphone_install complete');
      }
    }
    return true;
  };

}(REIN.module('ios'), REIN, $, window));
