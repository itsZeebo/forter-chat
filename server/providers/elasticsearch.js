const { Client } = require('@elastic/elasticsearch');

/**@type {Client} */
let _client;

function initClient() {
  _client = new Client({
    // cloud: {
    //   id: process.env.ES_CLOUD_ID
    // },
    // auth: {
    //   username: process.env.ES_USER,
    //   password: process.env.ES_PASSWORD
    // },
    node: 'http://localhost:9200',
    pingTimeout: 30000,
    maxRetries: 5,
    resurrectStrategy: 'optimistic'
  });
}

/**
 * Get all messages on the chat history.
 *
 * @returns all chat history.
 */
async function loadChatHistory() {
  try {
    const countResponse = await _client.count({
      index: 'chat-history'
    });

    const result = await _client.search({
      index: 'chat-history',
      body: {
        sort: {
          timestamp: { order: 'asc' }
        },
        size: countResponse.body.count,
        query: {
          match_all: {}
        }
      }
    });

    return result.body.hits.hits?.map((hit) => hit._source);
  } catch (exception) {
    console.error(JSON.stringify(exception));
  }
}

/**
 * Sends a message to the chat
 *
 * @param {String} sender
 * @param {String} content
 */
async function sendMessage(sender, content, timestamp) {
  try {
    const result = await _client.index({
      index: 'chat-history',
      body: {
        sender,
        content,
        timestamp
      }
    });
  } catch (exception) {
    console.error(exception);
  }
}

async function getAnswerForQuestion(phrase) {
  try {
    const now = new Date();
    const findMatchingQuestion = await _client.search({
      index: 'chat-history',
      body: {
        size: 1,
        min_score: 2.5,
        query: {
          bool: {
            should: [
              {
                regexp: {
                  content: {
                    value: '*?*'
                  }
                }
              },
              {
                match: {
                  content: {
                    query: phrase,
                    fuzziness: 'AUTO',
                    analyzer: 'standard'
                  }
                }
              }
            ]
          }
        }
      }
    });

    const question = findMatchingQuestion.body.hits.hits[0]?._source;

    if (!question) return;

    const answer = await _client.search({
      index: 'chat-history',
      body: {
        sort: {
          timestamp: { order: 'asc' }
        },
        query: {
          bool: {
            must: [
              {
                range: {
                  timestamp: {
                    gt: question.timestamp
                  }
                }
              }
            ],
            must_not: [
              {
                match: {
                  sender: question.sender
                }
              },
              {
                wildcard: {
                  content: {
                    value: '*\\?*'
                  }
                }
              }
            ]
          }
        }
      }
    });

    return answer.body.hits.hits[0]?._source;
  } catch (exception) {
    console.error(exception);
  }
}

module.exports = {
  getAnswerForQuestion,
  sendMessage,
  loadChatHistory,
  initClient
};
