import m from 'mithril';
import Districts from './db/districts';
import Marks from './db/marks';
import Cuts from './db/cuts';

function renderMark(mark) {
  const [c1, c2] = Cuts[mark.cutId];
  return m('li.mark', [
    m('figure.image', [
      m('p.owner', `${mark.firstName} ${mark.lastName}`),
      m('svg.cut',
        { preserveAspectRatio: 'xMidYMid meet', viewBox: '0 0 430 150'},
        [ m('g',
            { transform: 'translate(0,150) scale(0.1,-0.1)', fill: '#303030' },
            [ m('path', { d: c1 }), m('path', { d: c2 }) ]
           )
        ])
    ])
  ]);
}

const BrowseDistrict = {};
BrowseDistrict.controller = function() {
  const dId = m.route.param('districtId');
  const district = Districts.find(d => d.id == dId);
  const marks = Marks.filter(m => m.district == dId);
  return { district, marks };
};
BrowseDistrict.view = function(ctrl) {
  return m('section', [ 
      m('h1', ctrl.district.name),
      m('ul.list', ctrl.marks.map(renderMark))
  ]);
};

export default BrowseDistrict;
