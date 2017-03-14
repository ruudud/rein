const html = require('choo/html');
const footer = require('./footer');

const layout = view => (state, prev, send) => {
	return html`
		<div class="content">
			${view(state, prev, send)}
			${footer(state, prev, send)}
		</div>
	`;
};

module.exports = layout;
