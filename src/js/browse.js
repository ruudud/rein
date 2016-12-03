import m from 'mithril';
import areas from './db/areas';

const Area = {};
Area.controller = d => d;

Area.view = function(area) {
  return m('li.item', [
           m('a.itemLink',
             { href: `/fylke/${area.id}`, config: m.route },
             [
               area.name,
               m('br'),
               m('span.subText', `Antall merker: ${area.count}`),
               m('i.follow', '▶')
             ])]);
};

const Browse = {};
Browse.view = function() {
  return m('ul.list', areas.map(a => m.component(Area, a)));
};

export default Browse;
