import areas from '../db/areas';
import districts from '../db/districts';
import marks from '../db/marks';

const getArea = id => areas.find(a => a.id === id);
const getDistrict = id => districts.find(d => d.id === id);

function findMarks(s) {
	const needle = s.toLowerCase().trim();
	return marks
		.filter(m => (m.firstName + m.lastName).toLowerCase().indexOf(needle) > -1)
		.map(m => Object.assign(
				{},
				m,
				{loc: `${getArea(m.area).name} - ${getDistrict(m.district).name}`}
		));
}

export default {
	namespace: 'marks',
	state: {needle: '', items: []},
	reducers: {
		reset: () => ({needle: '', items: []}),
		find: (state, data) => ({needle: data, items: findMarks(data)})
	}
};
