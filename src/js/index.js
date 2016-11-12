import m from 'mithril';
import App from './app';

m.route(document.getElementById('app'), '/', {
  '/': App
});

