/** @jsx React.DOM **/
var React = require('react');
var _ = require('underscore');

var Counties = require('../register/counties');

var $container = document.getElementById('main');

var list = function() {
  var CountyList = require('../views/county-list');

  React.renderComponent(
    <CountyList data={Counties} />,
    $container
  );
};

var show = function(countyId) {
  var County = require('../views/county-show');
  var model = _.findWhere(Counties, { id: parseInt(countyId, 10) });

  React.renderComponent(
    <County county={model} />,
    $container
  );
};


module.exports = {
  list: list,
  show: show
};
