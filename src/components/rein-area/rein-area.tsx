import { Component, Prop } from '@stencil/core';
import { MatchResults } from '@stencil/router';
import {getById as getDistrictById} from '../db/districts';
import {getById as getAreaById} from '../db/areas';

@Component({
  tag: 'rein-area',
  styleUrl: 'rein-area.scss'
})
export class ReinArea {
  
  @Prop() match: MatchResults;

  render() {
    const areaId = this.match && this.match.params.id;
    function renderDistrict(id) {
      const d = getDistrictById(id);
      return (
        <li class="item">
          <a class="itemLink" href={"/distrikt/" + d.id}>
            {d.name}<br/>
            <span class="subText">Antall merker: {"X"}</span>
            <i class="follow">
              <img src="/assets/arrow.svg" width="30" height="30"/>
            </i>
          </a>
        </li>
      );
    };

    if (areaId) {
      const area = getAreaById(areaId);
      return (
        <main>
          <h2><a href="/">Norge</a></h2>
          <h1>{area.name}</h1>
          <nav>
            <ul class="list">
              { area.districts.map(renderDistrict) }
            </ul>
          </nav>
        </main>
      );
    } else {
      return (
        <div>Kunne ikke finne område</div>
      );
    }
  }
}
