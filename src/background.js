/*global chrome*/

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    injectContentScriptToAllTabs()
  }
});

function injectContentScriptToAllTabs() {
  chrome.tabs.query({})
    .then(tabs => {
      tabs.forEach(tab => {
        chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['static/js/content.js'] });
        chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: ['static/css/content.css'] });
      })
    });
}
