const html = require('choo/html');
const createLocation = require('sheet-router/create-location');
const Mark = require('./mark');

module.exports = (state, prev, send) => {
	function onLoad() {
		const {search} = createLocation();
		if (search.q && search.q.length > 0) {
			send('marks:find', search.q);
		}
	}
	function onSubmit(e) {
		e.preventDefault();
		const needle = e.target.children[0].value;
		send('marks:find', needle);
		send('location:set', `/finn?q=${needle}`);
	}
	const needle = state.marks.needle;
	const hits = state.marks.items.length;

	const hitsStr = hits ? `- ${hits} treff` : '';

	return html`
		<main onload=${onLoad} onunload=${() => send('marks:reset')}>
			<h1>Søk ${hitsStr}</h1>
			<section class="content-inner">
				<form onsubmit=${onSubmit} method="get">
					<input type="text" name="q" value="${needle}" placeholder="Navn på eier">
					<input type="submit" value="Søk" class="button button--text">
				</form>
				<ul class="list">
					${state.marks.items.map(Mark)}
				</ul>
			</section>
		</main>
	`;
};
