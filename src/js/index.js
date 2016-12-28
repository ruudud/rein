import choo from 'choo';

import AppModel from './models/app';
import MarkModel from './models/marks';

import Browse from './views/browse';
import BrowseArea from './views/browse-area';
import BrowseDistrict from './views/browse-district';
import Layout from './views/layout';
import Search from './views/search';


const app = choo();

app.model(AppModel);
app.model(MarkModel);

app.router([
  [ '/finn', Layout(Search) ],
  [ '/distrikt/:districtId', Layout(BrowseDistrict) ],
  [ '/fylke/:areaId', Layout(BrowseArea) ],
  [ '/', Layout(Browse) ],
]);

if (process.env.NODE_ENV !== 'production') {
  // dep NOT removed in prod build, probably confused by import vs require()
  const log = require('choo-log');
  app.use(log());
}

const tree = app.start();
document.body.replaceChild(tree, document.getElementById('app'));
