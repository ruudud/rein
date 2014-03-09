var director = require('director');

var AppEvents = require('./eventbus');
var Counties = require('./controllers/counties');

// The welcome page is the Counties list for now.
var mainPage = Counties.list;

var routes = {
  '/counties/:id': Counties.list,
  '': mainPage
};

var config = {
  notfound: mainPage
};

var router = new director.Router(routes).configure(config);

router.init('/');
