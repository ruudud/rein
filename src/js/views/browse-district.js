import html from 'choo/html';
import areas from '../db/areas';
import districts from '../db/districts';
import marks from '../db/marks';
import mark from './mark';

const getDistrictArea = id => areas.find(a => a.districts.find(d => d === id));
const getDistrict = id => districts.find(d => d.id === id);
const getMarks = id => marks.filter(m => m.district === id);

function browseDistrict(state) {
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
}

export default browseDistrict;
