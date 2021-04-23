import { html, css, query } from '../components/base';
import { urlForName } from '../router';
import { PageElement } from '../helpers/page-element';
import { UsersList } from '../components/usersList';
import { ChatRoom } from '../components/chatRoom';
import { connect as connectSocket } from '../providers/socket';

export class PageHome extends PageElement {
  static get properties() {
    return {
      username: { type: String },
      onlineUsers: { type: Array },
      messageHistory: { type: Array }
    };
  }

  constructor() {
    super();

    this.username = null;
  }

  @query('#username') _usernameInput;

  render() {
    return html`<div class="home-container">
      ${!this.username &&
      html`<div class="login-overlay">
        <div class="title"></div>
        <input type="text" id="username" />
        <button type="button" @click=${this._loginUser}>Login</button>
      </div>`}
      <users-list></users-list>
      <chat-room></chat-room>
    </div>`;
  }

  _loginUser() {
    const username = this._usernameInput.value.trim();

    if (!username) {
      alert('Username was not entered!');
      return;
    }

    this.username = username;
    connectSocket(username);
  }
}

customElements.define('page-home', PageHome);
