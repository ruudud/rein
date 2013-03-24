this["REIN"] = this["REIN"] || {};
this["REIN"]["templates"] = this["REIN"]["templates"] || {};

this["REIN"]["templates"]["area"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+=''+
(m.name)+
'<br>\n<span class="subText">Antall merker: '+
(m.count)+
'</span>\n<i class="follow">▶</i>\n';
}
return __p;
};

this["REIN"]["templates"]["browse"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<ul class="areas list selectable"></ul>\n<section class="districts"></section>\n<section class="marks"></section>\n';
}
return __p;
};

this["REIN"]["templates"]["canvas"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<canvas width="430" height="150"></canvas>\n';
}
return __p;
};

this["REIN"]["templates"]["districts"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<h2 class="sectionHeader">'+
(title)+
'</h2>\n<ul class="list"></ul>\n';
}
return __p;
};

this["REIN"]["templates"]["install"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div>\n  <div class="homescreen">\n    <section class="desc">\n    <h2 class="add">Legg til på <strong>Hjem-skjermen</strong></h2>\n    <h4 class="help">\n      <a href="http://www.apple.com/no/ios/add-to-home-screen/">\n        Hvordan?\n      </a>\n    </h4>\n    </section>\n  </div>\n</div>\n';
}
return __p;
};

this["REIN"]["templates"]["list"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<h2 class="sectionHeader">'+
(title)+
'</h2>\n<ul class="list '+
(className)+
'"></ul>\n';
}
return __p;
};

this["REIN"]["templates"]["mark"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<figure class="image">\n  <p class="owner">\n    <strong>'+
(mark.firstName)+
' '+
(mark.lastName)+
'</strong>\n  </p>\n</figure>\n<div class="information">\n  <div class="content">\n    <strong>'+
(districtName)+
'</strong><br/>\n    <em>\n      '+
(mark.address)+
' '+
(mark.place)+
'\n    </em>\n  </div>\n</div>\n';
}
return __p;
};

this["REIN"]["templates"]["search"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<form method="post" action="." class="searchForm">\n  <input type="text" placeholder="Navn på eier" class="wide boxed rounded" x-webkit-speech>\n  <input type="submit" class="wide button btnText search rounded" value="Søk">\n</form>\n';
}
return __p;
};

this["REIN"]["templates"]["svg"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<svg style="max-height: 130px" preserveAspectRatio="xMinYMin meet" width="100%" viewBox="0 0 430 150">\n<g transform="translate(0,150) scale(0.1,-0.1)" fill="#303030">\n  <path d="'+
(left)+
'"/>\n  <path d="'+
(right)+
'"/>\n</g>\n</svg>\n';
}
return __p;
};