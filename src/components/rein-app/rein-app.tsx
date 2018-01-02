import { Component } from '@stencil/core';


@Component({
  tag: 'rein-app',
  styleUrl: 'rein-app.scss'
})
export class ReinApp {

  componentDidLoad() {
    const $boot = document.getElementById('bootloader');
    if ($boot) $boot.remove();
  }

  render() {
    return (
      <div>
        <header>
          <img src="/assets/icon/icon-transp.png" />
          <h1>Reinmerker</h1>
        </header>

        <main class="content">
          <stencil-router>
            <stencil-route url='/' component='rein-areas' exact={true}/>
            <stencil-route url='/fylke/:id' component='rein-area' exact={true}/>
            <stencil-route url='/distrikt/:id' component='rein-district' exact={true}/>
          </stencil-router>
        </main>
      </div>
    );
  }
}
