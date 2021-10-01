import React from 'react';
import DiscordIcon from './icons/discord_icon.js';
import GithubIcon from './icons/github_icon.js';
import { DISCORD_INVITE_LINK, COMAKE_LANDING_PAGE_LINK, GITHUB_REPO_LINK } from './constants.js';

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
  }, {
    keys: ['Alt', 'F'],
    text: 'to focus the searchbar (or just start typing)'
  }
]

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

      <div class={'yipyip-info-panel-section-header yipyip-info-panel-margin-top-section-header'}>Keyboard Shortcuts</div>
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

      <div class={'yipyip-info-panel-section-header yipyip-info-panel-margin-top-section-header'}>
        Made with ❤️ by <a id={'yipyip-comake-link'} href={COMAKE_LANDING_PAGE_LINK} target='_blank' rel="noreferrer">COMAKE</a>
      </div>
      <a class={'yipyip-info-panel-button'} href={GITHUB_REPO_LINK} target='_blank' rel="noreferrer">
        <GithubIcon /> Contribute on Github
      </a>
      <a class={'yipyip-info-panel-button'} href={DISCORD_INVITE_LINK} target='_blank' rel="noreferrer">
        <DiscordIcon /> Join us on Discord
      </a>
    </div>
  )
}

export default InfoPanel;
