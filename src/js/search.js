import html from 'choo/html';

const Search = (state, prev, send) => html`
  <section>
    <form class="searchForm">
      <input type="text" placeholder="Navn på eier" class="wide boxed rounded">
      <input type="submit" value="Søk" class="wide button btnText search rounded">
    </form>
  </section>
`;

export default Search;
