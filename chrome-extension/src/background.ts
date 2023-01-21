import { MessageRequest, MessageResponse } from './request';

const BACKEND_URL = 'http://localhost:3030';

const generateErrorMessage = (
  type: 'serverError' | 'networkError' | 'invalidMessage'
): MessageResponse => ({
  succeeded: false,
  message:
    type === 'serverError'
      ? 'Server error.'
      : type === 'networkError'
      ? 'Network error.'
      : 'Invalid message.',
});

chrome.runtime.onMessage.addListener(
  (message: MessageRequest, _, sendResponse) => {
    if (message && message instanceof Object && 'type' in message) {
      // add a tweet
      if (
        message.type === 'add-tweet' &&
        'body' in message &&
        'id' in message.body
      ) {
        fetch(`${BACKEND_URL}/tweet`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: [message.body.id] }),
        })
          .then((response) => {
            const messageResponse: MessageResponse = response.ok
              ? { succeeded: true, message: 'Added a tweet.' }
              : generateErrorMessage('serverError');
            sendResponse(messageResponse);
          })
          .catch(() => {
            sendResponse(generateErrorMessage('networkError'));
          });
        return true;
      }

      // get the stored tweet list
      if (message.type === 'get-tweets') {
        fetch(`${BACKEND_URL}/tweet`, { method: 'GET' })
          .then((response) => {
            if (!response.ok) {
              sendResponse(generateErrorMessage('serverError'));
            } else {
              response.json().then((json) => {
                sendResponse({
                  succeeded: true,
                  body: json,
                });
              });
            }
            return;
          })
          .catch(() => {
            sendResponse(generateErrorMessage('networkError'));
          });
        return true;
      }
    }

    // invalid message
    sendResponse(generateErrorMessage('invalidMessage'));
    return true;
  }
);
