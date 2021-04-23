import { html, css } from 'lit-element';
import { urlForName } from '../router';
import { PageElement } from '../helpers/page-element';
import { UsersList } from '../components/usersList';
import { ChatRoom } from '../components/chatRoom';

export class PageHome extends PageElement {
  render() {
    return html` <div class="home-container">
      <users-list></users-list>
      <chat-room></chat-room>
    </div>`;
  }
}

customElements.define('page-home', PageHome);
