/*global chrome*/
import React from 'react';
import ExtensionMessageTypes from '../extension_message_types.js';

const useExtensionMessaging = ({ handleBrowserActionClicked }) => {

  const handleExtensionMessage = React.useCallback((message, sender, sendResponse) => {
    switch (message.type) {
      case ExtensionMessageTypes.BROWSER_ACTION_CLICKED:
        handleBrowserActionClicked()
        break;
      case ExtensionMessageTypes.CONTENT_SCRIPT_INSTALLED:
        sendResponse({ status: true })
        break;
    }
  }, [handleBrowserActionClicked])

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(handleExtensionMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleExtensionMessage);
    }
  }, [handleExtensionMessage]);
}

export default useExtensionMessaging;
