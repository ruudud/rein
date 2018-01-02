import { Component } from '@stencil/core';
import { areas } from '../db/areas';


@Component({
  tag: 'rein-areas',
  styleUrl: 'rein-areas.scss'
})
export class ReinAreas {

  render() {
    function renderArea(a) {
      return (
        <li class="item">
          <a class="itemLink" href={"/fylke/" + a.id}>
            {a.name}<br/>
            <span class="subText">Antall merker: {a.count}</span>
            <i class="follow">
              <img src="/assets/arrow.svg" width="30" height="30"/>
            </i>
          </a>
        </li>
      );
    }

    return (
      <div>
        <p>
          Welcome to the thing.
        </p>

        <ul class="list">
          { areas.map(renderArea) }
        </ul>
      </div>
    );
  }
}
