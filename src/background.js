/*global chrome*/
import ExtensionMessageTypes from './extension_message_types.js';
import { SETTINGS_KEYS } from './constants.js';

chrome.action.onClicked.addListener(tab => sendBrowserActionClickedMessageToTab(tab))
chrome.storage.onChanged.addListener(handleStorageChangeEvent);
chrome.runtime.onInstalled.addListener(handleInstallationEvent);
chrome.tabs.onUpdated.addListener(handleTabUpdatedEvent);

function handleInstallationEvent(details) {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.storage.local.get([SETTINGS_KEYS.USER_EMAIL], (data) => {
      if (data[SETTINGS_KEYS.USER_EMAIL] != null) {
        injectContentScriptToAllTabs()
      } else {
        turnBrowserExtensionStoreIntoLoginPage()
      }
    });
  }
}

function handleStorageChangeEvent(changes, storageNamespace) {
  if (storageNamespace === 'local' &&
    changes.hasOwnProperty(SETTINGS_KEYS.USER_EMAIL) &&
    changes[SETTINGS_KEYS.USER_EMAIL].newValue != null
  ) {
    injectContentScriptToAllTabs()
  }
}

function handleTabUpdatedEvent(tabId, changeInfo) {
  if (changeInfo && changeInfo.status === 'complete') {
    chrome.storage.local.get([SETTINGS_KEYS.USER_EMAIL], (data) => {
      if (data[SETTINGS_KEYS.USER_EMAIL] != null) {
        injectContentScriptToTab(tabId)
      }
    })
  }
}

function sendBrowserActionClickedMessageToTab(tab) {
  chrome.storage.local.get([SETTINGS_KEYS.USER_EMAIL], (data) => {
    if (data[SETTINGS_KEYS.USER_EMAIL] != null) {
      chrome.tabs.sendMessage(tab.id, { type: ExtensionMessageTypes.BROWSER_ACTION_CLICKED });
    } else {
      openLoginPage()
    }
  });
}

function injectContentScriptToAllTabs() {
  chrome.tabs.query({})
    .then(tabs => {
      tabs.forEach(tab => injectContentScriptToTab(tab.id))
    });
}

function injectContentScriptToTab(tabId) {
  chrome.scripting.executeScript({ target: { tabId: tabId }, files: ['static/js/content.js'] });
  chrome.scripting.insertCSS({ target: { tabId: tabId }, files: ['static/css/content.css'] });
}

function turnBrowserExtensionStoreIntoLoginPage() {
  chrome.tabs.query({ currentWindow: true, active: true })
    .then(tabs => {
      if (tabs && tabs[0]) {
        const loginPageUrl = getLoginURL();
        chrome.tabs.update({ url: loginPageUrl });
      }
    });
}

function openLoginPage() {
  const loginPageUrl = getLoginURL();
  chrome.tabs.create({ url: loginPageUrl })
}

function getLoginURL() {
  return chrome.runtime.getURL('login.html')
}
