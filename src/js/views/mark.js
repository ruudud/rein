import html from 'choo/html';
import cuts from '../db/cuts';

function mark(mark) {
	const [c1, c2] = cuts[mark.cutId];
	return html`
		<li class="mark">
			<figure class="image">
				<p class="desc">
					<strong>${mark.firstName} ${mark.lastName}</strong>
				</p>
				<p class="desc">${mark.loc}</p>
				<svg class="cut"
						 preserveAspectRatio="xMidYMid meet"
						 viewBox="0 0 430 150">
					<g transform="translate(0,150) scale(0.1,-0.1)" fill="#303030">
						<path d=${c1}/>
						<path d=${c2}/>
					</g>
				</svg>
			</figure>
		</li>
	`;
}

export default mark;
