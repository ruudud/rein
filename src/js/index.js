import choo from 'choo';
import html from 'choo/html';

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

app.router(route => [
  route('/finn', Layout(Search)),
  route('/distrikt/:districtId', Layout(BrowseDistrict)),
  route('/fylke/:areaId', Layout(BrowseArea)),
  route('/', Layout(Browse))
]);

const tree = app.start('#app');
