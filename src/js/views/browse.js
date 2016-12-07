import html from 'choo/html';
import areas from '../db/areas';

const Area = (area) => html`
  <li class="item">
    <a class="itemLink" href="/fylke/${area.id}">
      ${area.name}<br>
      <span class="subText">Antall merker: ${area.count}</span>
      <i class="follow">▶</i>
    </a>
  </li>
`;

const Browse = (state, prev, send) => html`
  <ul class="list">
    ${areas.map(a => Area(a))}
  </ul>
`;

export default Browse;
