import { LitElement, css, html } from './base';

const USERS = ['Omer', 'Tomer', 'Ofer', 'Someone'];

export class UsersList extends LitElement {
  static get styles() {
    return css`
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
    `;
  }

  render() {
    return html`
      <div class="title">Online Users:</div>
      ${USERS.map(
        (user) => html`<div class="user">
          <span class="status-indicator"></span>
          ${user}
        </div>`
      )}
    `;
  }
}

customElements.define('users-list', UsersList);
