import React from 'react';
import Utils from '../lib/utils.js';

import useDocumentEvent from './use_document_event.js';
import keyboardShortcuts from '../data/keyboard_shortcuts.json';

const useKeyboardShortcuts = (handleShortcut) => {
  const isMacOS = React.useMemo(() => Utils.isMacOS(), []);

  const eventMatchesShortcutFlags = React.useCallback((flags, event, discluded=false) => {
    const currentOSFlags = (isMacOS && flags.mac) || flags.default;
    return currentOSFlags.every(flag => (discluded ? !event[flag] : event[flag]))
  }, [isMacOS])

  const shortcutMatchesEvent = React.useCallback((shortcut, event) => {
    const eventMatcher = shortcut.eventMatcher;
    return eventMatcher &&
      (!eventMatcher.code || eventMatcher.code === event.code) &&
      (!eventMatcher.flags || eventMatchesShortcutFlags(eventMatcher.flags, event)) &&
      (!eventMatcher.discludedFlags || eventMatchesShortcutFlags(eventMatcher.discludedFlags, event, true))
  }, [eventMatchesShortcutFlags])

  const findShortcutMatchingEvent = React.useCallback(event => {
    return keyboardShortcuts.find(shortcut => shortcutMatchesEvent(shortcut, event))
  }, [shortcutMatchesEvent])

  const handleKeyEvent = React.useCallback(event => {
    const matchingShortcut = findShortcutMatchingEvent(event);
    if (matchingShortcut && matchingShortcut.name) {
      handleShortcut(matchingShortcut.name, event)
    }
  }, [handleShortcut, findShortcutMatchingEvent])

  useDocumentEvent('keydown', true, handleKeyEvent)
}

export default useKeyboardShortcuts
