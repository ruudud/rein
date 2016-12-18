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
  <main>
    <h1>Norge</h1>
    <nav>
      <ul class="list">
        ${areas.map(a => Area(a))}
      </ul>
    </nav>
  </main>
`;

export default Browse;
