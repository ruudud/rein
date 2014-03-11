/** @jsx React.DOM **/
var React = require('react');

var District = React.createClass({
  render: function() {
    return (
      <a href={"#/district/" + this.props.district.id}>
        <li className="item">
          {this.props.district.name}<br/>
          <span className="subText">Antall merker: {this.props.district.count}</span>
          <i className="follow">▶</i>
        </li>
      </a>
    );
  }
});

var DistrictList = React.createClass({
  render: function() {
    var districtNodes = this.props.data.map(function(d) {
      return <District key={d.id} district={d} />
    });
    return (
      <ul className="selectable list">
        {districtNodes}
      </ul>
    );
  }
});

var County = React.createClass({
  render: function() {
    return (
      <section>
        <h2 className="sectionHeader">{this.props.county.name}</h2>
        <DistrictList data={this.props.county.districts} />
      </section>
    );
  }
});

module.exports = County
