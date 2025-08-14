const DEFAULT_RULES = [
  {
    id: 'reddit-subreddit-blocker',
    name: 'Reddit Subreddit Blocker',
    pattern: `^https?://(?:www\.)?reddit\.com/r/[^/]+/?(?:(?:(?:hot|new|rising|top|best|controversial)/)?(?:\?t=(?:hour|day|week|month|year|all))?)?$`,
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

let currentRules = [];
let editingRuleId = null;

const rulesContainer = document.getElementById('rulesContainer');
const addRuleBtn = document.getElementById('addRuleBtn');
const modal = document.getElementById('ruleModal');
const modalTitle = document.getElementById('modalTitle');
const ruleNameInput = document.getElementById('ruleName');
const rulePatternInput = document.getElementById('rulePattern');
const ruleDestinationInput = document.getElementById('ruleDestination');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const toastNotification = document.getElementById('toastNotification');

const ruleTemplate = document.getElementById('ruleTemplate');
const emptyStateTemplate = document.getElementById('emptyStateTemplate');

async function loadRules() {
  try {
    const result = await chrome.storage.sync.get(['redirectRules']);
    currentRules = result.redirectRules || DEFAULT_RULES;
    renderRules();
  } catch (error) {
    console.error('Failed to load rules:', error);
    currentRules = DEFAULT_RULES;
    renderRules();
  }
}

async function saveRules() {
  try {
    await chrome.storage.sync.set({ redirectRules: currentRules });
  } catch (error) {
    console.error('Failed to save rules:', error);
  }
}

function renderRules() {
  rulesContainer.innerHTML = '';

  if (currentRules.length === 0) {
    const emptyState = emptyStateTemplate.content.cloneNode(true);
    rulesContainer.appendChild(emptyState);
    return;
  }

  currentRules.forEach((rule) => {
    const ruleElement = createRuleElement(rule);
    rulesContainer.appendChild(ruleElement);
  });
}

function createRuleElement(rule) {
  const ruleElement = ruleTemplate.content.cloneNode(true);
  const ruleItem = ruleElement.querySelector('.rule-item');
  const ruleName = ruleElement.querySelector('.rule-name');
  const ruleDestination = ruleElement.querySelector('.rule-destination');
  const toggle = ruleElement.querySelector('.toggle-switch');
  const deleteBtn = ruleElement.querySelector('.delete-btn');
  const ruleInfo = ruleElement.querySelector('.rule-info');

  ruleItem.dataset.ruleId = rule.id;
  ruleName.textContent = rule.name;
  ruleDestination.textContent = `Redirects to: ${rule.destination}`;

  if (rule.enabled) {
    toggle.classList.add('enabled');
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleRule(rule.id);
  });
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    deleteRule(rule.id);
  });
  ruleInfo.addEventListener('click', () => editRule(rule.id));

  return ruleElement;
}

function generateId() {
  return `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function toggleRule(ruleId) {
  const rule = currentRules.find((r) => r.id === ruleId);
  if (rule) {
    rule.enabled = !rule.enabled;
    saveRules();
    renderRules();
    showToast(rule.enabled ? 'Rule enabled' : 'Rule disabled');
  }
}

function deleteRule(ruleId) {
  const ruleName = currentRules.find((r) => r.id === ruleId)?.name;
  if (confirm(`Are you sure you want to delete the "${ruleName}" rule?`)) {
    currentRules = currentRules.filter((r) => r.id !== ruleId);
    saveRules();
    renderRules();
    showToast('Rule deleted');
  }
}

function editRule(ruleId) {
  const rule = currentRules.find((r) => r.id === ruleId);
  if (rule) {
    editingRuleId = ruleId;
    modalTitle.textContent = 'Edit Rule';
    ruleNameInput.value = rule.name;
    rulePatternInput.value = rule.pattern;
    ruleDestinationInput.value = rule.destination;
    showModal();
  }
}

function showModal() {
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.querySelector('.modal-content').style.transform = 'translateY(0)';
    modal.querySelector('.modal-content').style.opacity = 1;
    ruleNameInput.focus();
  }, 10);
}

function hideModal() {
  const modalContent = modal.querySelector('.modal-content');
  modalContent.style.transform = 'translateY(20px)';
  modalContent.style.opacity = 0;
  setTimeout(() => {
    modal.style.display = 'none';
    editingRuleId = null;
    ruleNameInput.value = '';
    rulePatternInput.value = '';
    ruleDestinationInput.value = '';
  }, 300);
}

function saveRule() {
  const name = ruleNameInput.value.trim();
  const pattern = rulePatternInput.value.trim();
  const destination = ruleDestinationInput.value.trim();

  if (!name || !pattern || !destination) {
    showToast('All fields are required.', 'error');
    return;
  }

  try {
    new RegExp(pattern);
  } catch (error) {
    showToast('Invalid Regex pattern.', 'error');
    return;
  }

  try {
    new URL(destination);
  } catch (error) {
    showToast('Invalid destination URL.', 'error');
    return;
  }

  if (editingRuleId) {
    const rule = currentRules.find((r) => r.id === editingRuleId);
    if (rule) {
      rule.name = name;
      rule.pattern = pattern;
      rule.destination = destination;
    }
  } else {
    const newRule = {
      id: generateId(),
      name,
      pattern,
      destination,
      enabled: true,
    };
    currentRules.push(newRule);
  }

  saveRules();
  renderRules();
  hideModal();
  showToast(editingRuleId ? 'Rule updated' : 'Rule added');
}

let toastTimer;
function showToast(message, type = 'success') {
  clearTimeout(toastTimer);
  toastNotification.textContent = message;
  toastNotification.className = `toast-notification ${type}`;
  toastNotification.classList.add('show');
  toastTimer = setTimeout(() => {
    toastNotification.classList.remove('show');
  }, 3000);
}

addRuleBtn.addEventListener('click', () => {
  editingRuleId = null;
  modalTitle.textContent = 'Add New Rule';
  showModal();
});

saveBtn.addEventListener('click', saveRule);
cancelBtn.addEventListener('click', hideModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    hideModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (modal.style.display === 'flex') {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      saveRule();
    } else if (e.key === 'Escape') {
      hideModal();
    }
  }
});

document.addEventListener('DOMContentLoaded', loadRules);
