import m from 'mithril';

const Search = {};
Search.view = function() {
  return m('section', [
    m('form.searchForm', [
      m('input', { type: 'text', placeholder: 'Navn på eier', class: 'wide boxed rounded' }),
      m('input', { type: 'submit', value: 'Søk', class: 'wide button btnText search rounded' })
    ]),
  ]);
};

export default Search;
