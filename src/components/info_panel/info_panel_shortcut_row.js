import React from 'react';

const InfoPanelShortcutRow = (props) => {
  const { isMacOS, shortcut } = props;

  const keys = React.useMemo(() => {
    return (isMacOS && shortcut.displayKeys.mac) || shortcut.displayKeys.default
  }, [shortcut, isMacOS])

  return (
    <div class={'yipyip-info-panel-row'}>
      { keys.map(key => {
          return <div key={key} class={'yipyip-info-panel-shortcut-key'}>{key}</div>
        })
      }
      <div class={'yipyip-info-panel-shortcut-text'}>{ shortcut.text }</div>
    </div>
  )
}

export default InfoPanelShortcutRow;
