import DiscordIcon from '../icons/discord.js';
import GithubIcon from '../icons/github.js';
import InfoPanelButton from './info_panel_button.js';

import { DISCORD_INVITE_LINK, GITHUB_REPO_LINK } from '../../constants.js';

const InfoPanelButtons = (props) => {
  const buttons = [
    {
      link: GITHUB_REPO_LINK,
      icon: <GithubIcon />,
      text: 'Contribute on Github'
    }, {
      link: DISCORD_INVITE_LINK,
      icon: <DiscordIcon />,
      text: 'Join us on Discord'
    }
  ]

  return (
    <>
      { buttons.map(buttonProps => {
          return <InfoPanelButton
            key={buttonProps.text}
            {...buttonProps}
          />
        })
      }
    </>
  )
}

export default InfoPanelButtons;
