import React from 'react';
import Utils from '../../lib/utils.js';
import InfoPanelShortcutRow from './info_panel_shortcut_row.js';
import keyboardShortcuts from '../../data/keyboard_shortcuts.json';

const InfoPanelKeyboardShortcuts = () => {
  const isMacOS = React.useMemo(() => Utils.isMacOS(), []);

  return (
    <>
      { keyboardShortcuts.map(shortcut => {
          return <InfoPanelShortcutRow
            key={shortcut.text}
            isMacOS={isMacOS}
            shortcut={shortcut}
          />
        })
      }
    </>
  )
}

export default InfoPanelKeyboardShortcuts
