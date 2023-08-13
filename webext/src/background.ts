import { MessageRequest, MessageResponse } from './request';
import browser from 'webextension-polyfill';

const backendUrl = process.env.BACKEND_URL;

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
        try {
          const response = await fetch(`${backendUrl}/tweet`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids: [message.body.id] }),
          });
          return response.ok
            ? { succeeded: true, message: 'Added a tweet.' }
            : generateErrorMessage('serverError');
        } catch {
          return generateErrorMessage('networkError');
        }
      }

      // add a parsed tweet
      if (
        message.type === 'add-parsed-tweet' &&
        'body' in message &&
        [
          'tweetId',
          'tweetBody',
          'tweetCreatedAt',
          'imgSrcs',
          'screenName',
          'userName',
        ].every((field) => field in message.body)
      ) {
        try {
          const response = await fetch(`${backendUrl}/parsed-tweet`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(message.body),
          });
          return response.ok
            ? { succeeded: true, message: 'Added a tweet.' }
            : generateErrorMessage('serverError');
        } catch {
          return generateErrorMessage('networkError');
        }
      }

      // get the stored tweet list
      if (message.type === 'get-tweets') {
        try {
          const response = await fetch(`${backendUrl}/tweet`, {
            method: 'GET',
          });
          if (!response.ok) {
            throw new Error('serverError');
          }
          return {
            succeeded: true,
            body: await response.json(),
          };
        } catch (error) {
          if ('serverError' === error) {
            return generateErrorMessage('serverError');
          }
          return generateErrorMessage('networkError');
        }
      }
    }

    // invalid message
    return generateErrorMessage('invalidMessage');
  }
);
