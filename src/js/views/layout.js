import html from 'choo/html';
import Footer from './footer';

const Layout = (View) => (state, prev, send) => {
  return html`
    <div>
      ${View(state, prev, send)}
      ${Footer(state, prev, send)}
    </div>
  `;
};

export default Layout;
