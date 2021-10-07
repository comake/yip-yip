/*global chrome*/
import React from 'react';

const SETTINGS_KEYS = {
  AUTO_HIDE: 'autoHide',
  USE_ON_EVERY_WEBSITE: 'useOnEveryWebsite'
}

const useExtensionStorage = () => {
  const [autoHide, setAutoHide] = React.useState(true)
  const [useOnEveryWebsite, setUseOnEveryWebsite] = React.useState(false)

  const updateAutoHide = React.useCallback(newAutoHide => {
    setAutoHide(newAutoHide)
    chrome.storage.local.set({ [SETTINGS_KEYS.AUTO_HIDE]: newAutoHide });
  }, [])

  const updateUseOnEveryWebsite = React.useCallback(newUseOnEveryWebsite => {
    setUseOnEveryWebsite(newUseOnEveryWebsite)
    chrome.storage.local.set({ [SETTINGS_KEYS.USE_ON_EVERY_WEBSITE]: newUseOnEveryWebsite });
  }, [])

  const initializeStoredSettings = React.useCallback(data => {
    if (data.hasOwnProperty(SETTINGS_KEYS.AUTO_HIDE)) {
      setAutoHide(Boolean(data[SETTINGS_KEYS.AUTO_HIDE]));
    }
    if (data.hasOwnProperty(SETTINGS_KEYS.USE_ON_EVERY_WEBSITE)) {
      setUseOnEveryWebsite(Boolean(data[SETTINGS_KEYS.USE_ON_EVERY_WEBSITE]));
    }
  }, [])

  const updateStoredSettings = React.useCallback((changes, storageNamespace) => {
    if (storageNamespace === 'local') {
      if (changes.hasOwnProperty(SETTINGS_KEYS.AUTO_HIDE)) {
        setAutoHide(Boolean(changes[SETTINGS_KEYS.AUTO_HIDE].newValue));
      }
      if (changes.hasOwnProperty(SETTINGS_KEYS.USE_ON_EVERY_WEBSITE)) {
        setUseOnEveryWebsite(Boolean(changes[SETTINGS_KEYS.USE_ON_EVERY_WEBSITE].newValue));
      }
    }
  }, [])

  React.useEffect(() => {
    chrome.storage.local.get(Object.values(SETTINGS_KEYS), initializeStoredSettings);
    chrome.storage.onChanged.addListener(updateStoredSettings);
  }, [])

  return {
    autoHide,
    updateAutoHide,
    useOnEveryWebsite,
    updateUseOnEveryWebsite
  }
}

export default useExtensionStorage;
