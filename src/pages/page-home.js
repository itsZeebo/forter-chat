import { html, css, query } from '../components/base';
import { urlForName } from '../router';
import { PageElement } from '../helpers/page-element';
import { UsersList } from '../components/usersList';
import { ChatRoom } from '../components/chatRoom';
import {
  connect as connectSocket,
  registerToSocket
} from '../providers/socket';

const UNSUBSCRIBERS = [];

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
    this.onlineUsers = null;
    this.messageHistory = null;
  }

  connectedCallback() {
    super.connectedCallback();
    UNSUBSCRIBERS.push(
      registerToSocket(
        'onlineUsers',
        ([{ users }]) => (this.onlineUsers = users)
      )
    );
    UNSUBSCRIBERS.push(
      registerToSocket(
        'getHistory',
        ([{ messages }]) => (this.messageHistory = messages)
      )
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    // Unsubscribe from everything
    UNSUBSCRIBERS.map((cb) => cb());
  }

  render() {
    return html`<div class="home-container">
      ${!this.username
        ? html`<div class="login-overlay">
            <div class="login-container">
              <div class="title">
                <img src="/images/logo.png" class="logo" />
                Welcome to ChatApp!<br />
                Please Enter your username to login:
              </div>
              <input class="ca-input" type="text" id="username" />
              <button class="ca-button" type="button" @click=${this._loginUser}>
                Login
              </button>
            </div>
          </div>`
        : ''}
      <users-list
        .currentUser=${this.username}
        .onlineUsers=${this.onlineUsers}
      ></users-list>
      <chat-room
        .currentUser=${this.username}
        .messages=${this.messageHistory}
      ></chat-room>
    </div>`;
  }

  _loginUser() {
    const username = document.getElementById('username').value.trim();

    if (!username) {
      alert('Username was not entered!');
      return;
    }

    this.username = username;
    connectSocket(username);
  }
}

customElements.define('page-home', PageHome);
