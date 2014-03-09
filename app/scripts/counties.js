/** @jsx React.DOM **/
var React = require('react');

var Counties = require('./register/counties');

var County = React.createClass({
  render: function() {
    return (
      <li className="item">
        {this.props.name}<br/>
        <span className="subText">
          Antall merker: {this.props.markCount}
        </span>
        <i className="follow">▶</i>
      </li>
    );
  }
});

var CountyList = React.createClass({
  render: function() {
    var countyNodes = this.props.data.map(function(county) {
      return <County name={county.name} markCount={county.count} />
    });
    return (
      <ul className="selectable list">
        {countyNodes}
      </ul>
    );
  }
});

React.renderComponent(
  <CountyList data={Counties} />,
  document.getElementById('counties')
);
