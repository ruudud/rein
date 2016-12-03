import m from 'mithril';
import Browse from './browse';
import BrowseArea from './browse-area';
import BrowseDistrict from './browse-district';
import Search from './search';

m.route.mode = 'pathname';

m.route(document.getElementById('app'), '/', {
  '/finn': Search,
  '/fylke/:areaId': BrowseArea,
  '/distrikt/:districtId': BrowseDistrict,
  '/': Browse
});

