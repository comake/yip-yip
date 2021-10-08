import { ReactComponent as DiscordIcon } from '../../icons/discord.svg';
import { ReactComponent as GithubIcon } from '../../icons/github.svg';
import { ReactComponent as TwitterIcon } from '../../icons/twitter.svg';
import InfoPanelButton from './info_panel_button.js';

import { DISCORD_INVITE_LINK, GITHUB_REPO_LINK, TWITTER_LINK } from '../../constants.js';

const InfoPanelButtons = (props) => {
  const buttons = [
    {
      link: GITHUB_REPO_LINK,
      icon: <GithubIcon />,
      text: 'Contribute on Github'
    },
    {
      link: DISCORD_INVITE_LINK,
      icon: <DiscordIcon />,
      text: 'Join us on Discord'
    },
    {
      link: TWITTER_LINK,
      icon: <TwitterIcon />,
      text: 'Tweet about YipYip!'
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
