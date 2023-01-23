import browser from 'webextension-polyfill';

export interface MessageResponse {
  succeeded: boolean;
  message?: string;
  body?: unknown;
}

export interface MessageRequest {
  type: 'add-tweet' | 'get-tweets';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
}

export const sendMessage = (
  request: MessageRequest
): Promise<MessageResponse> => {
  return browser.runtime.sendMessage(request);
};
