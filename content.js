const DEFAULT_RULES = [
  {
    id: 'reddit-subreddit',
    name: 'Reddit Subreddit Redirect',
    pattern: `^https?:\/\/(?:www\.)?reddit\.com\/r\/[^\/]+(?:\/(?:hot|new|rising|top|best|controversial))?(?:\/?\?t=(hour|day|week|month|year|all))?\/?$`,
    destination: 'https://www.reddit.com',
    enabled: true,
  },
  {
    id: 'youtube-feed-blocker',
    name: 'YouTube Feed Blocker',
    pattern: `^https?://(?:www\.)?youtube\.com/?$`,
    destination:
      'https://www.youtube.com/results?search_query=python+clean+code',
    enabled: true,
  },
  {
    id: 'facebook-feed-redirect',
    name: 'Facebook Feed Redirect',
    pattern: `/^https:\/\/www\.facebook\.com\/?$/`,
    destination: 'https://www.facebook.com/marketplace',
    enabled: true,
  },
];

let redirectRules = [];

async function loadRules() {
  try {
    const result = await chrome.storage.sync.get(['redirectRules']);
    redirectRules = result.redirectRules || DEFAULT_RULES;
  } catch (error) {
    console.log('Failed to load rules, using defaults:', error);
    redirectRules = DEFAULT_RULES;
  }
}

function shouldRedirect(url) {
  for (const rule of redirectRules) {
    if (!rule.enabled) continue;

    try {
      const regex = new RegExp(rule.pattern);
      if (regex.test(url)) {
        return rule.destination;
      }
    } catch (error) {
      console.warn(
        `Invalid regex pattern in rule "${rule.name}":`,
        rule.pattern
      );
    }
  }
  return null;
}

function performRedirect(destination) {
  window.location.replace(destination);
}

function checkAndRedirect() {
  const currentUrl = window.location.href;
  const redirectDestination = shouldRedirect(currentUrl);

  if (redirectDestination) {
    performRedirect(redirectDestination);
  }
}

async function init() {
  await loadRules();
  checkAndRedirect();
}

init();

let lastUrl = window.location.href;

const observer = new MutationObserver(async () => {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    await loadRules();
    checkAndRedirect();
  }
});

observer.observe(document, {
  subtree: true,
  childList: true,
});

window.addEventListener('popstate', async () => {
  await loadRules();
  checkAndRedirect();
});

const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function () {
  originalPushState.apply(history, arguments);
  setTimeout(async () => {
    await loadRules();
    checkAndRedirect();
  }, 0);
};

history.replaceState = function () {
  originalReplaceState.apply(history, arguments);
  setTimeout(async () => {
    await loadRules();
    checkAndRedirect();
  }, 0);
};
