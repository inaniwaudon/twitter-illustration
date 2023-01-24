import { MessageRequest, MessageResponse } from './request';
import browser from 'webextension-polyfill';

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

browser.runtime.onMessage.addListener(
  async (message: MessageRequest, _): Promise<MessageResponse> => {
    if (message && message instanceof Object && 'type' in message) {
      // add a tweet
      if (
        message.type === 'add-tweet' &&
        'body' in message &&
        'id' in message.body
      ) {
        return fetch(`${BACKEND_URL}/tweet`, {
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
            //sendResponse(messageResponse);
            return messageResponse;
          })
          .catch(() => {
            //sendResponse(generateErrorMessage('networkError'));
            return generateErrorMessage('networkError');
          });
        //return true;
      }

      // get the stored tweet list
      if (message.type === 'get-tweets') {
        return fetch(`${BACKEND_URL}/tweet`, { method: 'GET' })
          .then((response) => {
            if (!response.ok) {
              //sendResponse(generateErrorMessage('serverError'));
              //return generateErrorMessage('serverError');
              throw new Error('serverError');
            } else {
              return response.json();
              /*
                sendResponse({
                  succeeded: true,
                  body: json,
                });
                 */
            }
          })
          .then((json) => {
            return {
              succeeded: true,
              body: json,
            } as MessageResponse;
          })
          .catch((error) => {
            //sendResponse(generateErrorMessage('networkError'));
            //return Promise.resolve(generateErrorMessage('networkError'));
            if ('serverError' === error)
              return generateErrorMessage('serverError');
            return generateErrorMessage('networkError');
          });
        //return true;
      }
    }

    // invalid message
    //sendResponse(generateErrorMessage('invalidMessage'));
    return Promise.resolve(generateErrorMessage('networkError'));
    //return true;
  }
);
