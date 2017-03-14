const choo = require('choo');

const appModel = require('./models/app');
const markModel = require('./models/marks');

const browse = require('./views/browse');
const browseArea = require('./views/browse-area');
const browseDistrict = require('./views/browse-district');
const layout = require('./views/layout');
const search = require('./views/search');

const app = choo();

if (process.env.NODE_ENV !== 'production') {
	const log = require('choo-log');
	app.use(log());
}

app.model(appModel);
app.model(markModel);

app.router([
	['/finn', layout(search)],
	['/distrikt/:districtId', layout(browseDistrict)],
	['/fylke/:areaId', layout(browseArea)],
	['/', layout(browse)]
]);

const tree = app.start();
document.body.replaceChild(tree, document.getElementById('app'));
