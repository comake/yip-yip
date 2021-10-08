/*global chrome*/
import React from 'react';
import ExtensionMessageTypes from '../extension_message_types.js';

const useExtensionMessaging = ({ handleBrowserActionClicked }) => {

  const handleExtensionMessage = React.useCallback(message => {
    switch (message.type) {
      case ExtensionMessageTypes.BROWSER_ACTION_CLICKED:
        handleBrowserActionClicked()
        break;
    }
  }, [handleBrowserActionClicked])

  React.useEffect(() => {
    console.debug('adding addListener')
    chrome.runtime.onMessage.addListener(handleExtensionMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleExtensionMessage);
    }
  }, [handleExtensionMessage]);
}

export default useExtensionMessaging;
