import { html } from 'lit-element';
import { urlForName } from '../router';
import { PageElement } from '../helpers/page-element';

export class PageHome extends PageElement {
  render() {
    return html` <div class="home-container">ayo</div> `;
  }
}

customElements.define('page-home', PageHome);
