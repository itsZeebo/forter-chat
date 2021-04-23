import { LitElement, css, html } from './base';
import moment from 'moment/src/moment';

const MESSAGES = [
  {
    user: 'Omer',
    content: 'Hello World!',
    timestamp: new Date(Date.now() - 7323234234)
  },
  {
    user: 'Tomer',
    content: 'Hello World!',
    timestamp: new Date(Date.now() - 6323234234)
  },
  {
    user: 'Offer',
    content: 'Hello World!',
    timestamp: new Date(Date.now() - 5323234234)
  },
  {
    user: 'Omer',
    content: 'Hello World!',
    timestamp: new Date(Date.now() - 4323234234)
  },
  {
    user: 'Someone',
    content: 'Hello World!',
    timestamp: new Date(Date.now() - 3323234234)
  },
  {
    user: 'Someone',
    content: 'Hello Worlddddddddddddddddddddddddddddddddd!',
    timestamp: new Date(Date.now() - 3323234234)
  },
  {
    user: 'Someone',
    content: 'Hello World!',
    timestamp: new Date(Date.now() - 20000)
  }
];

export class ChatRoom extends LitElement {
  static get styles() {
    return css`
      :host {
        width: 80%;
        padding: 20px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        overflow-y: auto;
        overflow-x: hidden;
        max-height: calc(100vh - 80px);
        box-sizing: border-box;
      }
      .message {
        margin: 10px;
        min-width: 150px;
        position: relative;
        padding: 10px;
        display: flex;
        flex-direction: column;
        background-color: var(--light-background);
        box-shadow: 0 4px 7px rgba(0, 0, 0, 0.15);
      }
      .tail {
        position: absolute;
        height: 20px;
        width: 20px;
        top: 0;
        left: -10px;
        background-color: var(--light-background);
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 0);
      }
      .timestamp {
        align-self: flex-end;
        right: 0;
        font-size: 12px;
        font-style: italic;
        color: var(--borders-dark);
        margin-top: -5px;
      }
      .sender {
        font-size: 16px;
        font-weight: bold;
      }
      .content {
        font-size: 14px;
      }
    `;
  }

  render() {
    return html`
      ${MESSAGES.map(
        ({ user, timestamp, content }) => html`<div class="message">
          <div class="tail"></div>
          <div class="timestamp">${moment(timestamp).fromNow()}</div>
          <div class="sender">${user}:</div>
          <div class="content">${content}</div>
        </div>`
      )}
    `;
  }
}

customElements.define('chat-room', ChatRoom);
