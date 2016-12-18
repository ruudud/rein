import html from 'choo/html';
import areas from '../db/areas';
import districts from '../db/districts';
import marks from '../db/marks';

const getArea = id => areas.find(a => a.id == id);
const getDistrict = id => districts.find(d => d.id == id);
const markCount = id => marks.reduce((c, m) => c + (m.district == id ? 1 : 0), 0);

function District(id) {
  const count = markCount(id);
  const district = getDistrict(id);
  return html`
    <li class="item">
      <a class="itemLink" href="/distrikt/${id}">
        ${district.name}<br>
        <span class="subText">Antall merker: ${count}</span>
        <i class="follow">▶</i>
      </a>
    </li>
  `;
}

function BrowseArea(state, prev, send) {
  const area = getArea(state.location.params.areaId);
  return html`
    <section>
      <h1>${area.name}</h1>
      <ul class="list">
        ${area.districts.map(District)}
      </ul>
    </section>
  `;
}

export default BrowseArea;
