this["REIN"] = this["REIN"] || {};
this["REIN"]["templates"] = this["REIN"]["templates"] || {};

this["REIN"]["templates"]["area"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p +=
((__t = (m.name)) == null ? '' : __t) +
'<br>\n<span class="subText">Antall merker: ' +
((__t = (m.count)) == null ? '' : __t) +
'</span>\n<i class="follow">▶</i>\n';

}
return __p
};

this["REIN"]["templates"]["browse"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<ul class="areas list selectable"></ul>\n<section class="districts"></section>\n<section class="marks"></section>\n';

}
return __p
};

this["REIN"]["templates"]["canvas"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<canvas width="430" height="150"></canvas>\n';

}
return __p
};

this["REIN"]["templates"]["districts"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h2 class="sectionHeader">' +
((__t = (title)) == null ? '' : __t) +
'</h2>\n<ul class="list"></ul>\n';

}
return __p
};

this["REIN"]["templates"]["install"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div>\n  <div class="homescreen"></div>\n</div>\n';

}
return __p
};

this["REIN"]["templates"]["installBubble"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="addToHomeScreen" style="' +
((__t = ( styles )) == null ? '' : __t) +
'" class="' +
((__t = ( classes )) == null ? '' : __t) +
'">\n  Trykk på <span class="' +
((__t = ( icon )) == null ? '' : __t) +
'"></span> og så<br/>\n  <strong>Legg til på Hjem-skjerm<strong>.\n  <span class="addToHomeArrow"></span>\n</div>\n';

}
return __p
};

this["REIN"]["templates"]["list"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h2 class="sectionHeader">' +
((__t = (title)) == null ? '' : __t) +
'</h2>\n<ul class="list ' +
((__t = (className)) == null ? '' : __t) +
'"></ul>\n';

}
return __p
};

this["REIN"]["templates"]["mark"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<figure class="image">\n  <p class="owner">\n    <strong>' +
((__t = (mark.firstName)) == null ? '' : __t) +
' ' +
((__t = (mark.lastName)) == null ? '' : __t) +
'</strong>\n  </p>\n</figure>\n<div class="information">\n  <div class="content">\n    <strong>' +
((__t = (districtName)) == null ? '' : __t) +
'</strong><br/>\n    <em>\n      ' +
((__t = (mark.address)) == null ? '' : __t) +
' ' +
((__t = (mark.place)) == null ? '' : __t) +
'\n    </em>\n  </div>\n</div>\n';

}
return __p
};

this["REIN"]["templates"]["search"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<form method="post" action="." class="searchForm">\n  <input type="text" placeholder="Navn på eier" class="wide boxed rounded" x-webkit-speech>\n  <input type="submit" class="wide button btnText search rounded" value="Søk">\n</form>\n';

}
return __p
};

this["REIN"]["templates"]["svg"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<svg style="max-height: 130px" preserveAspectRatio="xMinYMin meet" width="100%" viewBox="0 0 430 150">\n<g transform="translate(0,150) scale(0.1,-0.1)" fill="#303030">\n  <path d="' +
((__t = (left)) == null ? '' : __t) +
'"/>\n  <path d="' +
((__t = (right)) == null ? '' : __t) +
'"/>\n</g>\n</svg>\n';

}
return __p
};