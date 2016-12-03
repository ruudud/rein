import m from 'mithril';
import areas from './db/areas';
import districts from './db/districts';
import marks from './db/marks';

function renderDistrict(dId) {
  const count = marks.reduce((c, m) => c + (m.district == dId ? 1 : 0), 0);
  const district = districts.find(d => d.id == dId);
  return m('li.item', [
           m('a.itemLink',
             { href: `/distrikt/${dId}`, config: m.route },
             [
               district.name,
               m('br'),
               m('span.subText', `Antall merker: ${count}`),
               m('i.follow', '▶')
             ])]);
}

const BrowseArea = {};
BrowseArea.controller = function() {
  return areas.find(a => a.id == m.route.param('areaId'));
};
BrowseArea.view = function(area) {
  return m('section', [ 
      m('h1', area.name),
      m('ul.list', area.districts.map(renderDistrict))
  ]);
};

export default BrowseArea;
