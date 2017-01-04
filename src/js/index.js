import choo from 'choo';

import appModel from './models/app';
import markModel from './models/marks';

import browse from './views/browse';
import browseArea from './views/browse-area';
import browseDistrict from './views/browse-district';
import layout from './views/layout';
import search from './views/search';

const app = choo();

app.model(appModel);
app.model(markModel);

app.router([
	['/finn', layout(search)],
	['/distrikt/:districtId', layout(browseDistrict)],
	['/fylke/:areaId', layout(browseArea)],
	['/', layout(browse)]
]);

if (process.env.NODE_ENV !== 'production') {
	// dep NOT removed in prod build, probably confused by import vs require()
	const log = require('choo-log');
	app.use(log());
}

const tree = app.start();
document.body.replaceChild(tree, document.getElementById('app'));
