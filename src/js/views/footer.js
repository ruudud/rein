import html from 'choo/html';

const Footer = (state) => html`
  <footer>
    <p>
      Reinmerker 2016 - ${state.app.version}<br>
      Laget av Pål Ruud og Niila Blind.<br>
      Merker basert på informasjon i
      <a target="_blank" href="http://merker.reindrift.no/">Merkeregisteret</a>.<br>
      Kildekoden er åpent
      <a target="_blank" href="https://github.com/ruudud/ReindeerFinder">tilgjengelig</a>
      under
      <a target="_blank" href="http://www.gnu.org/licenses/agpl-3.0.html">Affero General Public License</a>.<br>
      <a href="/privacy-policy.html">Personvernerklæring</a>
    </p>
  </footer>
`;

export default Footer;
