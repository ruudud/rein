import choo from 'choo';
import Browse from './browse';
import BrowseArea from './browse-area';
import BrowseDistrict from './browse-district';
import Search from './search';

const app = choo();
app.router(route => [
  route('/finn', Search),
  route('/distrikt/:districtId', BrowseDistrict),
  route('/fylke/:areaId', BrowseArea),
  route('/', Browse)
]);

const tree = app.start('#app');
