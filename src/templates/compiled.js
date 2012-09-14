this['REINMERKE']['templates'] = this['REINMERKE']['templates'] || {};

this['REINMERKE']['templates']['mark'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<figure class="image">\n  <p>\n    <strong class="owner">'+
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

this['REINMERKE']['templates']['svg'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<svg width="320px" height="160px" viewBox="0 0 430 150">\n<g transform="translate(0,150) scale(0.1,-0.1)" fill="#303030">\n  <path d="'+
(left)+
'"/>\n  <path d="'+
(right)+
'"/>\n</g>\n</svg>\n';
}
return __p;
};