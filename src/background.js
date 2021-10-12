/*global chrome*/
import ExtensionMessageTypes from './extension_message_types.js';
import WebRequest from './lib/web_request.js';
import { SETTINGS_KEYS, YIPYIP_WELCOME_LINK } from './constants.js';

chrome.action.onClicked.addListener(tab => sendBrowserActionClickedMessageToTab(tab))
chrome.runtime.onInstalled.addListener(handleInstallationEvent);

function handleInstallationEvent(details) {
  injectContentScriptToAllTabs()

  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.storage.local.get([SETTINGS_KEYS.USER_EMAIL], (data) => {
      if (data[SETTINGS_KEYS.USER_EMAIL] != null) {
        turnBrowserExtensionStoreIntoWelcomePage()
      } else {
        turnBrowserExtensionStoreIntoLoginPage()
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
  chrome.tabs.sendMessage(tabId, { type: ExtensionMessageTypes.CONTENT_SCRIPT_INSTALLED }, (msg) => {
    msg = msg || {};
    if (!msg.status) {
      chrome.scripting.executeScript({ target: { tabId: tabId }, files: ['static/js/content.js'] });
      chrome.scripting.insertCSS({ target: { tabId: tabId }, files: ['static/css/content.css'] });
    }
  });
}

function turnBrowserExtensionStoreIntoWelcomePage() {
  chrome.tabs.query({ currentWindow: true, active: true })
    .then(tabs => {
      if (tabs && tabs[0]) {
        chrome.tabs.update(tabs[0].id, { url: YIPYIP_WELCOME_LINK });
      }
    });
}

function turnBrowserExtensionStoreIntoLoginPage() {
  chrome.tabs.query({ currentWindow: true, active: true })
    .then(tabs => {
      if (tabs && tabs[0]) {
        const loginPageUrl = getLoginURL();
        chrome.tabs.update(tabs[0].id, { url: loginPageUrl });
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
