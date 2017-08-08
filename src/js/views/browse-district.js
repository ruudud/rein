const html = require('choo/html');
const areas = require('../db/areas');
const districts = require('../db/districts');
const marks = require('../db/marks');
const mark = require('./mark');

const getDistrictArea = id => areas.find(a => a.districts.find(d => d == id));
const getDistrict = id => districts.find(d => d.id == id);
const getMarks = id => marks.filter(m => m.district == id);

module.exports = state => {
	const id = state.location.params.districtId;
	const district = getDistrict(id);
	const area = getDistrictArea(id);
	const marksInDistrict = getMarks(id);
	return html`
		<main>
			<h2>
				<a href="/">Norge</a> -
				<a href="/fylke/${area.id}">${area.name}</a>
			</h2>
			<h1>
				${district.name}
			</h1>
			<ul class="list">
				${marksInDistrict.map(mark)}
			</ul>
		</main>
	`;
};
