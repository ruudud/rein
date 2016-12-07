import html from 'choo/html';
import Mark from './mark';
import districts from '../db/districts';
import marks from '../db/marks';

const getDistrict = id => districts.find(d => d.id == id);
const getMarks = id => marks.filter(m => m.district == id);

function BrowseDistrict(state, prev, send) {
  const id = state.params.districtId;
  const district = getDistrict(id);
  const marksInDistrict = getMarks(id);
  return html`
    <section>
      <h1>${district.name}</h1>
      <ul class="list">
        ${marksInDistrict.map(Mark)}
      </ul>
    </section>
  `;
}

export default BrowseDistrict;
