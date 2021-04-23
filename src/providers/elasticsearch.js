import { Client } from '@elastic/elasticsearch';
import config from '../config';

/**@type {Client} */
let _client;

export function initClient() {
  const { esCloudId, esUser, esPass } = config;

  _client = new Client({
    cloud: {
      id: esCloudId
    },
    auth: {
      username: esUser,
      password: esPass
    }
  });
}

/**@type {Date} */
let _lastQuery;

/**
 * Get the latest messages on the chat history, that you haven't seen yet.
 *
 * @returns The latest messages since the last time queried.
 */
export async function loadChatHistory() {
  try {
    const now = new Date();
    const result = await _client.search({
      index: 'chat-history',
      body: {
        sort: {
          timestamp: { order: desc }
        },
        query: {
          range: {
            timestamp: {
              gt: _lastQuery || new Date('1970-01-01')
            }
          }
        }
      }
    });

    _lastQuery = now;

    return result.body.hits.hits?.map((hit) => hit._source);
  } catch (exception) {
    console.error(exception);
  }
}

/**
 * Sends a message to the chat
 *
 * @param {String} sender
 * @param {String} content
 */
export async function sendMessage(sender, content) {
  try {
    await _client.index({
      index: 'chat-history',
      body: {
        sender,
        content,
        timestamp: Date.now()
      }
    });
  } catch (exception) {
    console.error(exception);
  }
}
