/** @jsx React.DOM **/
var React = require('react');

var list = function(){
  var Counties = require('../register/counties');
  var CountyList = require('../views/counties');

  React.renderComponent(
    <CountyList data={Counties} />,
    document.getElementById('counties')
  );
};

module.exports = { list: list };
