import html from 'choo/html';
import footer from './footer';

const layout = view => (state, prev, send) => {
	return html`
		<div class="content">
			${view(state, prev, send)}
			${footer(state, prev, send)}
		</div>
	`;
};

export default layout;
