import html from 'choo/html';
import districts from './db/districts';
import marks from './db/marks';
import cuts from './db/cuts';

const getDistrict = id => districts.find(d => d.id == id);
const getMarks = id => marks.filter(m => m.district == id);

function Mark(mark) {
  const [c1, c2] = cuts[mark.cutId];
  return html`
    <li class="mark">
      <figure class="image">
        <p class="owner">${mark.firstName} ${mark.lastName}</p>
        <svg class="cut"
             preserveAspectRatio="xMidYMid meet"
             viewBox="0 0 430 150">
          <g transform="translate(0,150) scale(0.1,-0.1)" fill="#303030">
            <path d=${c1}/>
            <path d=${c2}/>
          </g>
        </svg>
      </figure>
    </li>
  `;
}

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
