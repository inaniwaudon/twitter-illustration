/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
const BACKEND_URL = 'http://localhost:3030';
const generateErrorMessage = (type) => ({
    succeeded: false,
    message: type === 'serverError'
        ? 'Server error.'
        : type === 'networkError'
            ? 'Network error.'
            : 'Invalid message.',
});
chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message && message instanceof Object && 'type' in message) {
        // add a tweet
        if (message.type === 'add-tweet' &&
            'body' in message &&
            'id' in message.body) {
            fetch(`${BACKEND_URL}/tweet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: [message.body.id] }),
            })
                .then((response) => {
                const messageResponse = response.ok
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
                }
                else {
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
});


/******/ })()
;
//# sourceMappingURL=background.js.map