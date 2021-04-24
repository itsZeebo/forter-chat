import { registerToSocket } from '../providers/socket';
import { LitElement, css, html } from './base';

const UNSUBSCRIBERS = [];
export class UsersList extends LitElement {
  static get properties() {
    return {
      onlineUsers: { type: Array },
      currentUser: { type: String }
    };
  }

  constructor() {
    super();
    this.onlineUsers = null;
    this.currentUser = null;
  }

  connectedCallback() {
    super.connectedCallback();

    UNSUBSCRIBERS.push(
      registerToSocket(
        'onlineUsers',
        ([{ users }]) => (this.onlineUsers = users)
      )
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    UNSUBSCRIBERS.map((cb) => cb());
  }

  static get styles() {
    return css`
      @media (max-width: 767px) {
        :host {
          display: none !important;
        }
      }
      :host {
        width: 20%;
        max-width: 400px;
        position: relative;
        display: flex;
        flex-direction: column;
        border-right: 1px solid var(--borders);
        overflow-y: auto;
        overflow-x: hidden;
        max-height: calc(100vh - 80px);
      }
      .title {
        color: var(--primary);
        font-size: 20px;
        font-weight: bold;
        text-transform: uppercase;
        padding: 10px 5px;
        border-bottom: 1px solid var(--borders-light);
      }
      .user {
        width: 100%;
        padding: 5px 15px;
        font-size: 18px;
        color: #333;
        border-bottom: 1px solid var(--borders-light);
        box-sizing: border-box;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        vertical-align: center;
      }
      .user .status-indicator {
        display: inline-block;
        height: 10px;
        width: 10px;
        background-color: green;
        margin-right: 10px;
        border-radius: 50%;
      }
      .user .you {
        color: var(--borders-dark);
        font-style: italic;
        margin-right: 5px;
        font-size: 14px;
      }
    `;
  }

  render() {
    return this.onlineUsers
      ? html` <div class="title">Online Users:</div>
          ${this.onlineUsers?.map(
            (user) => html`<div class="user">
              <span class="status-indicator"></span>
              ${user}
              ${user === this.currentUser
                ? html`<span class="you">- You</span>`
                : ''}
            </div>`
          )}`
      : html`<div>Please login to see connected users!</div>`;
  }
}

customElements.define('users-list', UsersList);
