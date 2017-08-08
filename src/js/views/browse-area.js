const html = require('choo/html');
const areas = require('../db/areas');
const districts = require('../db/districts');
const marks = require('../db/marks');

const getArea = id => areas.find(a => a.id == id);
const getDistrict = id => districts.find(d => d.id == id);
const markCount = id => marks.reduce((c, m) => c + (m.district == id ? 1 : 0), 0);

function district(id) {
	const count = markCount(id);
	const d = getDistrict(id);
	return html`
		<li class="item">
			<a class="itemLink" href="/distrikt/${id}">
				${d.name}<br>
				<span class="subText">Antall merker: ${count}</span>
				<i class="follow">▶</i>
			</a>
		</li>
	`;
}

module.exports = state => {
	const area = getArea(state.location.params.areaId);
	return html`
		<main>
			<h2><a href="/">Norge</a></h2>
			<h1>${area.name}</h1>
			<nav>
				<ul class="list">
					${area.districts.map(district)}
				</ul>
			</nav>
		</main>
	`;
};
