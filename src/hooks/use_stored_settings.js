/*global chrome*/
import React from 'react';
import { SETTINGS_KEYS } from '../constants.js';


const useStoredSettings = () => {
  const [autoHide, setAutoHide] = React.useState(false);
  const [useOnEveryWebsite, setUseOnEveryWebsite] = React.useState(true);
  const [userEmail, setUserEmail] = React.useState(null);
  const [alwaysOn, setAlwaysOn] = React.useState(true);

  const updateAutoHide = React.useCallback(newAutoHide => {
    setAutoHide(newAutoHide)
    chrome.storage.local.set({ [SETTINGS_KEYS.AUTO_HIDE]: newAutoHide });
  }, [])

  const updateUseOnEveryWebsite = React.useCallback(newUseOnEveryWebsite => {
    setUseOnEveryWebsite(newUseOnEveryWebsite)
    chrome.storage.local.set({ [SETTINGS_KEYS.USE_ON_EVERY_WEBSITE]: newUseOnEveryWebsite });
  }, [])

  const updateUserEmail = React.useCallback(newUserEmail => {
    setUserEmail(newUserEmail)
    chrome.storage.local.set({ [SETTINGS_KEYS.USER_EMAIL]: newUserEmail });
  }, [])

  const updateAlwaysOn = React.useCallback(newAlwaysOn => {
    setAlwaysOn(newAlwaysOn)
    chrome.storage.local.set({ [SETTINGS_KEYS.ALWAYS_ON]: newAlwaysOn });
  }, [])

  const initializeStoredSettings = React.useCallback(data => {
    if (data.hasOwnProperty(SETTINGS_KEYS.AUTO_HIDE)) {
      setAutoHide(Boolean(data[SETTINGS_KEYS.AUTO_HIDE]));
    }
    if (data.hasOwnProperty(SETTINGS_KEYS.USE_ON_EVERY_WEBSITE)) {
      setUseOnEveryWebsite(Boolean(data[SETTINGS_KEYS.USE_ON_EVERY_WEBSITE]));
    }
    if (data.hasOwnProperty(SETTINGS_KEYS.USER_EMAIL)) {
      setUserEmail(data[SETTINGS_KEYS.USER_EMAIL]);
    }
    if (data.hasOwnProperty(SETTINGS_KEYS.ALWAYS_ON)) {
      setAlwaysOn(data[SETTINGS_KEYS.ALWAYS_ON]);
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
      if (changes.hasOwnProperty(SETTINGS_KEYS.USER_EMAIL)) {
        setUserEmail(changes[SETTINGS_KEYS.USER_EMAIL].newValue);
      }
      if (changes.hasOwnProperty(SETTINGS_KEYS.ALWAYS_ON)) {
        setAlwaysOn(changes[SETTINGS_KEYS.ALWAYS_ON].newValue);
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
    updateUseOnEveryWebsite,
    userEmail,
    updateUserEmail,
    alwaysOn,
    updateAlwaysOn
  }
}

export default useStoredSettings;
