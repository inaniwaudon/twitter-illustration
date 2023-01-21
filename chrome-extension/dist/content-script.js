/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/request.ts":
/*!************************!*\
  !*** ./src/request.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "sendMessage": () => (/* binding */ sendMessage)
/* harmony export */ });
const sendMessage = (request) => new Promise((resolve) => {
    chrome.runtime.sendMessage(request, (response) => {
        resolve(response);
    });
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*******************************!*\
  !*** ./src/content-script.ts ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./request */ "./src/request.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

let registeredTweets = [];
const callback = () => {
    const url = location.href;
    if (!url.includes("/status")) {
        return;
    }
    // add a plus button
    const navigationQuery = ".css-1dbjc4n.r-k4xj1c.r-18u37iz.r-1wtj0ep";
    const navigation = document.querySelector(navigationQuery);
    if (!navigation) {
        return;
    }
    const className = "illustration-plus";
    const existingPlusButtons = navigation.getElementsByClassName(className);
    if (existingPlusButtons.length > 0) {
        return;
    }
    const id = url.replace(/^https:\/\/.*\/status\//, "").replace(/\/.*$/, "");
    const isAlreadyStored = registeredTweets.includes(id);
    const plusButton = document.createElement("div");
    plusButton.className = "illustration-plus";
    plusButton.innerHTML = isAlreadyStored ? "✓" : "+";
    if (!isAlreadyStored) {
        const onClickPlusButton = () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0,_request__WEBPACK_IMPORTED_MODULE_0__.sendMessage)({
                type: "add-tweet",
                body: { id },
            });
            if (response.succeeded) {
                registeredTweets.push(id);
                plusButton.innerHTML = "✓";
                plusButton.removeEventListener("click", onClickPlusButton);
            }
            else {
                alert(`Failed: ${response.message}`);
            }
        });
        plusButton.addEventListener("click", onClickPlusButton);
    }
    navigation.appendChild(plusButton);
};
window.addEventListener("load", () => __awaiter(void 0, void 0, void 0, function* () {
    // get stored tweets
    const storedTweetsResponse = yield (0,_request__WEBPACK_IMPORTED_MODULE_0__.sendMessage)({
        type: "get-tweets",
    });
    if (storedTweetsResponse.succeeded) {
        registeredTweets = storedTweetsResponse.body.map((line) => line.id);
    }
    // register a observer
    const registerObserver = () => {
        const timeline = document.querySelector("#react-root");
        if (timeline) {
            const observer = new MutationObserver(callback);
            observer.observe(timeline, { childList: true, subtree: true });
            callback();
        }
        else {
            setTimeout(registerObserver, 100);
        }
    };
    registerObserver();
}));

})();

/******/ })()
;
//# sourceMappingURL=content-script.js.map