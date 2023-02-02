import { sendMessage } from './request';

const usesApi = false;

let registeredTweets: string[] = [];
const plusButtonClassName = 'illustration-plus';

const removeAllButtons = () => {
  const existingPlusButtons =
    document.getElementsByClassName(plusButtonClassName);
  for (let i = 0; i < existingPlusButtons.length; i++) {
    existingPlusButtons[i].remove();
  }
};

const parseHTML = (tweet: Element, tweetPhotos: Element[]) => {
  const imgSrcs: string[] = [];
  let bodyText: string | null = null;
  let userName: string | null = null;
  let screenName: string | null = null;

  // get images
  for (const tweetPhoto of tweetPhotos) {
    if (tweetPhoto) {
      const img = tweetPhoto.querySelector('img');
      if (img && img.src) {
        imgSrcs.push(img.src);
      }
    }
  }
  // get a body
  const tweetText = tweet.querySelector('[data-testid="tweetText"]');
  if (tweetText) {
    bodyText = '';
    for (let i = 0; i < tweetText.childNodes.length; i++) {
      const node = tweetText.childNodes[i];
      if (node instanceof HTMLElement) {
        if (node.tagName.toLowerCase() === 'img' && node.hasAttribute('alt')) {
          bodyText += node.getAttribute('alt');
        } else {
          bodyText += node.textContent;
        }
      }
    }
  }
  // get user information
  const userNames = tweet.querySelector('[data-testid="User-Names"]');
  userName = userNames!.childNodes[0].textContent;
  screenName = userNames!.childNodes[1].textContent;

  return imgSrcs.length > 0 && bodyText && userName && screenName
    ? { imgSrcs, bodyText, userName, screenName }
    : null;
};

const callback = () => {
  // target a tweet page containing images
  const url = location.href;
  const tweet = document.querySelector('article[tabindex="-1"]');
  if (!tweet) {
    removeAllButtons();
    return;
  }
  const tweetPhotos = [
    ...Array.from(tweet.querySelectorAll('[data-testid="tweetPhoto"]')),
    ...Array.from(
      document.querySelectorAll('[data-testid="swipe-to-dismiss"]')
    ),
  ];

  if (!url.includes('/status') || tweetPhotos.length === 0) {
    removeAllButtons();
    return;
  }
  const parsed = !usesApi ? parseHTML(tweet, tweetPhotos) : null;
  if (!usesApi && !parsed) {
    removeAllButtons();
    console.error('Parsing is failed.');
    return;
  }

  // add a plus button
  const navigationQuery =
    '[data-testid="tweet"] .css-1dbjc4n.r-k4xj1c.r-18u37iz.r-1wtj0ep';
  const navigations = document.querySelectorAll(navigationQuery);
  if (navigations.length === 0) {
    return;
  }

  const id = url.replace(/^https:\/\/.*\/status\//, '').replace(/\/.*$/, '');
  const isAlreadyStored = registeredTweets.includes(id);

  for (let i = 0; i < navigations.length; i++) {
    if (navigations[i].getElementsByClassName(plusButtonClassName).length > 0) {
      continue;
    }

    const plusButton = document.createElement('div');
    plusButton.className = plusButtonClassName;
    plusButton.innerHTML = isAlreadyStored ? '✓' : '+';

    if (!isAlreadyStored) {
      const onClickPlusButton = async () => {
        const response = await sendMessage(
          usesApi
            ? {
                type: 'add-tweet',
                body: { id },
              }
            : {
                type: 'add-parsed-tweet',
                body: { id, ...parsed },
              }
        );
        if (response.succeeded) {
          registeredTweets.push(id);
          plusButton.innerHTML = '✓';
          plusButton.removeEventListener('click', onClickPlusButton);
        } else {
          alert(`Failed: ${response.message}`);
        }
      };
      plusButton.addEventListener('click', onClickPlusButton);
    }
    navigations[i].appendChild(plusButton);
  }
};

window.addEventListener('load', async () => {
  // get stored tweets
  const storedTweetsResponse = await sendMessage({
    type: 'get-tweets',
  });
  if (storedTweetsResponse.succeeded) {
    registeredTweets = storedTweetsResponse.body as string[];
  }

  // register a observer
  const registerObserver = () => {
    const timeline = document.querySelector('#react-root');
    if (timeline) {
      const observer = new MutationObserver(callback);
      observer.observe(timeline, { childList: true, subtree: true });
      callback();
    } else {
      setTimeout(registerObserver, 100);
    }
  };
  registerObserver();
});
