import { html, css, query } from '../components/base';
import { urlForName } from '../router';
import { PageElement } from '../helpers/page-element';
import { UsersList } from '../components/usersList';
import { ChatRoom } from '../components/chatRoom';
import {
  connect as connectSocket,
  registerToSocket
} from '../providers/socket';

export class PageHome extends PageElement {
  static get properties() {
    return {
      username: { type: String }
    };
  }

  constructor() {
    super();

    this.username = null;
  }

  render() {
    return html`<div class="home-container">
      ${!this.username
        ? html`<div class="login-overlay">
            <div class="login-container">
              <div class="title">
                <img src="/images/logo.png" class="logo" />
                Welcome to ChatApp!<br />
                Please Enter your username to start chatting:
              </div>
              <form @submit=${this._loginUser}>
                <input class="ca-input" type="text" id="username" />
                <button
                  class="ca-button"
                  type="button"
                  @click=${this._loginUser}
                >
                  Login
                </button>
              </form>
            </div>
          </div>`
        : ''}
      <users-list .currentUser=${this.username}></users-list>
      <chat-room .currentUser=${this.username}></chat-room>
    </div>`;
  }

  _loginUser(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();

    if (!username) {
      alert('Username was not entered!');
      return;
    }

    if (username === 'cleverBot') {
      alert('Please choose another username..');
      return;
    }

    this.username = username;
    connectSocket(username);
  }
}

customElements.define('page-home', PageHome);
