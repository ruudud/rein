import { Component, Prop } from '@stencil/core';
import { MatchResults } from '@stencil/router';
import {getAreaByDistrictId, getById as getAreaById} from '../db/areas';
import {cuts} from '../db/cuts';
import {getById as getDistrictById} from '../db/districts';
import {getByDistrictId as getMarksByDistrictId} from '../db/marks';

@Component({
  tag: 'rein-district',
  styleUrl: 'rein-district.scss'
})
export class ReinDistrict {
  
  @Prop() match: MatchResults;

  render() {
    function svg(mark) {
	    const [c1, c2] = cuts[mark.cutId];
      return `
		    <svg class="cut"
		    		 preserveAspectRatio="xMidYMid meet"
		    		 viewBox="0 0 430 150">
		    	<g transform="translate(0,150) scale(0.1,-0.1)" fill="#303030">
            <path d="${c1}"></path>
            <path d="${c2}"></path>
		    	</g>
		    </svg>
      `;
    }
    function renderMark(mark) {
      return (
		    <li class="mark">
		    	<figure class="image">
		    		<p class="desc">
		    			<strong>{mark.firstName} {mark.lastName}</strong>
		    		</p>
            <div innerHTML={svg(mark)}></div>
		    	</figure>
		    </li>
      );
    };

    const districtId = this.match && this.match.params.id;

    if (districtId) {
      const district = getDistrictById(districtId);
      const area = getAreaByDistrictId(districtId);
      const marksInDistrict = getMarksByDistrictId(districtId);
      return (
        <main>
          <h2>
            <a href="/">Norge</a> - <a href={"/fylke/" + area.id}>{area.name}</a>
          </h2>
          <h1>{district.name}</h1>

          <nav>
            <ul class="list">
              {marksInDistrict.map(renderMark)}
            </ul>
          </nav>
        </main>
      );
    } else {
      return (
        <div>Kunne ikke finne distrikt</div>
      );
    }
  }
}
