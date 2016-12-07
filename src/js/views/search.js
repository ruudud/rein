import html from 'choo/html';
import Mark from './mark';

function Search(state, prev, send) {
  function onSubmit(e) {
    e.preventDefault();
    send('marks:find', e.target.children[0].value);
  }
  return html`
    <section class="content">
      <form onsubmit=${onSubmit}>
        <input type="text" placeholder="Navn på eier">
        <input type="submit" value="Søk" class="button button--text">
      </form>
      <h3>Søketreff: ${state.marks.items.length || 0}</h3>
      <ul class="list">
        ${state.marks.items.map(Mark)}
      </ul>
    </section>
  `;
}

export default Search;
