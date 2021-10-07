import React from 'react';
import InfoPanelRow from './info_panel_row.js'

const InfoPanelShortcutRow = (props) => {
  const { isMacOS, shortcut } = props;

  const keys = React.useMemo(() => {
    return (isMacOS && shortcut.displayKeys.mac) || shortcut.displayKeys.default
  }, [shortcut, isMacOS])

  return (
    <InfoPanelRow>
      { keys.map(key => {
          return <div key={key} class={'yipyip-info-panel-shortcut-key'}>{key}</div>
        })
      }
      <div class={'yipyip-info-panel-shortcut-text'}>{ shortcut.text }</div>
    </InfoPanelRow>
  )
}

export default InfoPanelShortcutRow;
