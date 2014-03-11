/** @jsx React.DOM **/
var React = require('react');

var County = React.createClass({
  render: function() {
    return (
      <a href={"#/counties/" + this.props.county.id}>
        <li className="item">
          {this.props.county.name}<br/>
          <span className="subText">
            Antall merker: {this.props.county.count}
          </span>
          <i className="follow">▶</i>
        </li>
      </a>
    );
  }
});

var CountyList = React.createClass({
  render: function() {
    var countyNodes = this.props.data.map(function(county) {
      return <County key={county.id} county={county} />
    });
    return (
      <ul className="selectable list">
        {countyNodes}
      </ul>
    );
  }
});

module.exports = CountyList
