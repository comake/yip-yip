import React from 'react';

const howToSteps = [
  'Type to search for buttons or links in the page',
  'Press Tab to jump through the matches',
  'Press enter to select a match'
];

const keyboardShortcuts = [
  {
    keys: ['Tab'],
    text: 'to jump to the next match'
  },
  {
    keys: ['Shift', 'Tab'],
    text: 'to jump to the previous match'
  },
  {
    keys: ['Enter'],
    text: 'to click the selected match'
  }, {
    keys: ['Command', 'Delete'],
    text: 'to clear the searchbar'
  }
]

const STYLE = {};

const InfoPanel = () => {
  return (
    <div id={'yipyip-info-panel'}>
      <div class={'yipyip-info-panel-section-header'}>How to use YipYip!</div>
      <ol>
        { howToSteps.map(step => {
            return <li class={'yipyip-info-panel-list-item'}>{step}</li>
          })
        }
      </ol>

      <div class={'yipyip-info-panel-section-header'}>Keyboard Shortcuts</div>
      { keyboardShortcuts.map(shortcut => {
          return <div key={shortcut.text} class={'yipyip-info-panel-row'}>
            { shortcut.keys.map(key => {
                return <div key={key} class={'yipyip-info-panel-shortcut-key'}>{key}</div>
              })
            }
            <div class={'yipyip-info-panel-shortcut-text'}>{ shortcut.text }</div>
          </div>
        })
      }

      <div class={'yipyip-info-panel-section-header'}></div>
    </div>
  )
}

export default InfoPanel;
