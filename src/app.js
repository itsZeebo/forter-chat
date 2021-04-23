import { LitElement, html, css } from './components/base';
import { Header } from './components';

import config from './config';

import { attachRouter, urlForName } from './router';

export class App extends LitElement {
  render() {
    return html`
      ${Header()}
      <main role="main"></main>
    `;
  }

  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    attachRouter(this.querySelector('main'));
  }
}

customElements.define('app-index', App);
