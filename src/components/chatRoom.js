import { LitElement, css, html } from './base';
import moment from 'moment/src/moment';
import { registerToSocket, sendMessage } from '../providers/socket';
import {
  inputStyles,
  loader,
  slideLeftAnimation,
  slideRightAnimation
} from '../helpers/general-styles';

const UNSUBSCRIBERS = [];
const USER_COLORS = {};

export class ChatRoom extends LitElement {
  static get properties() {
    return {
      messages: { type: Array },
      currentUser: { type: String }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    UNSUBSCRIBERS.push(
      registerToSocket('message', ([sender, content, timestamp]) => {
        if (!USER_COLORS[sender]) USER_COLORS[sender] = this._getRandomColor();

        this.messages = [
          ...(this.messages || []),
          { sender, content, timestamp }
        ];

        if ('Notification' in window && Notification.permission === 'granted') {
          const notify = new Notification('New message on ChatApp!', {
            body: `${sender}: ${content}`,
            icon: '/images/logo.png',
            timestamp
          });
        }
      })
    );

    UNSUBSCRIBERS.push(
      registerToSocket('getHistory', ([{ messages }]) => {
        const uniqueSenders = this._getUniqueSenders(messages);

        // Initialize the user colors
        uniqueSenders.map(
          (sender) => (USER_COLORS[sender] = this._getRandomColor())
        );

        // Initialize the messages
        this.messages = [...(this.messages || []), ...messages];
      })
    );
  }

  updated() {
    super.updated();
    this.latestMessage?.scrollIntoView();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    UNSUBSCRIBERS.map((cb) => cb());
  }

  constructor() {
    super();
    this.messages = null;
    this.currentUser = null;
  }

  static get styles() {
    return [
      inputStyles,
      loader,
      slideLeftAnimation,
      slideRightAnimation,
      css`
        @media (max-width: 767px) {
          :host {
            width: 100% !important;
          }
        }
        :host {
          width: 80%;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          height: calc(100vh - 80px);
          max-height: calc(100vh - 80px);
          box-sizing: border-box;
        }
        .message-container {
          width: 100%;
          padding: 20px 10vw;
          position: relative;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          align-items: flex-start;
          overflow-y: auto;
          overflow-x: hidden;
          box-sizing: border-box;
        }
        .message {
          margin-top: 10px;
          min-width: 150px;
          position: relative;
          padding: 10px;
          display: flex;
          flex-direction: column;
          background-color: var(--light-background);
          box-shadow: 0 4px 7px rgba(0, 0, 0, 0.15);
          animation: SlideRight 0.3s ease-out;
        }
        .message.first {
          margin-top: 25px;
        }
        .message.me {
          background-color: var(--primary);
          color: white;
          align-self: flex-end;
          animation: SlideLeft 0.3s ease-out;
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
        .message.me .tail {
          background-color: var(--primary);
          clip-path: polygon(0 0, 100% 0, 0 100%, 0 0);
          left: auto;
          right: -10px;
          top: 0;
        }
        .timestamp {
          align-self: flex-end;
          right: 0;
          font-size: 12px;
          font-style: italic;
          color: var(--borders-dark);
          margin-top: -5px;
        }
        .message.me .timestamp {
          color: white;
        }
        .sender {
          font-size: 16px;
          font-weight: bold;
        }
        .content {
          font-size: 14px;
        }
        .send-message {
          width: 100%;
          display: flex;
          padding: 20px;
          border-top: 1px solid var(--borders);
          box-sizing: border-box;
          height: 80px;
          background-color: white;
        }
        .send-message form {
          width: 100%;
          display: flex;
        }
        .ca-button {
          border-bottom-right-radius: 5px;
          border-top-right-radius: 5px;
        }
        .ca-input {
          flex-grow: 1;
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
        }
      `
    ];
  }

  get usernameInput() {
    return this.shadowRoot.getElementById('message');
  }

  get latestMessage() {
    return this.shadowRoot.querySelector('.message:last-child');
  }

  render() {
    return !this.currentUser
      ? html`<div>Login to see message history!</div>`
      : !this.messages
      ? html`<div class="loader"></div>`
      : html`
          <div class="message-container" id="message-container">
            ${this.messages.map(({ sender, timestamp, content }, index) => {
              const isFirstInBundle =
                index === 0 || this.messages[index - 1].sender !== sender;
              const isMe = sender === this.currentUser;

              return html`<div
                class=${`message ${isMe ? 'me' : ''} ${
                  isFirstInBundle ? 'first' : ''
                }`}
              >
                ${isFirstInBundle ? html`<div class="tail"></div>` : ''}
                <div class="timestamp">${moment(timestamp).fromNow()}</div>
                ${isFirstInBundle
                  ? html`<div
                      class="sender"
                      style=${isMe ? '' : `color: ${USER_COLORS[sender]}`}
                    >
                      ${sender}:
                    </div>`
                  : ''}
                <div class="content">${content}</div>
              </div>`;
            })}
          </div>
          <div class="send-message">
            <form @submit=${this._sendMessage}>
              <input
                class="ca-input"
                type="text"
                placeholder="Enter your message here.."
                id="message"
              />
              <button @click=${this._sendMessage} class="ca-button">
                Send
              </button>
            </form>
          </div>
        `;
  }

  /**
   * Generate a random hsl color
   *
   * @returns {String} hsl css color string with a random hue, constant saturation of 100 and random lightness
   */
  _getRandomColor() {
    return `hsl(${Math.round(Math.random() * 360)}, 100%, ${Math.round(
      Math.random() * (45 - 25) + 25
    )}%)`;
  }

  _getUniqueSenders(messages) {
    const unique = [];

    messages.map(
      ({ sender }) => !unique.includes(sender) && unique.push(sender)
    );

    return unique;
  }

  /**
   *
   * @param {Event} e
   * @returns
   */
  _sendMessage(e) {
    e.preventDefault();
    const messageContent = this.usernameInput.value.trim();

    if (!messageContent) {
      alert('Please enter a message before sending!');
      return;
    }

    this.usernameInput.value = '';
    sendMessage(messageContent);
  }
}

customElements.define('chat-room', ChatRoom);
