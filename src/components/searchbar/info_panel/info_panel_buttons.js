import { ReactComponent as DiscordIcon } from '../../../icons/discord.svg';
import { ReactComponent as GithubIcon } from '../../../icons/github.svg';
import { ReactComponent as TwitterIcon } from '../../../icons/twitter.svg';
import { ReactComponent as FeedbackIcon } from '../../../icons/feedback.svg';
import InfoPanelButton from './info_panel_button.js';

import { DISCORD_INVITE_LINK, GITHUB_REPO_LINK, TWITTER_LINK, TYPEFORM_FEEDBACK_LINK } from '../../../constants.js';

const BUTTONS_PER_ROW = 2;

const InfoPanelButtons = (props) => {
  const buttons = [
    {
      link: GITHUB_REPO_LINK,
      icon: <GithubIcon />,
      text: 'Contribute on Github'
    },
    {
      link: TYPEFORM_FEEDBACK_LINK,
      icon: <FeedbackIcon />,
      text: 'Contribute without code'
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

  const numberOfButtonRows = Math.round(buttons.length / BUTTONS_PER_ROW);

  return (
    <>
      { [...Array(numberOfButtonRows)].map((rowNumber, index) => {
          const startIndex = index * BUTTONS_PER_ROW;
          const endIndex = (index+1) * BUTTONS_PER_ROW;
          return (
            <div key={index} class={'yipyip-info-panel-button-row'}>
              { buttons.slice(startIndex, endIndex).map(buttonProps => {
                  return <InfoPanelButton
                    key={buttonProps.text}
                    {...buttonProps}
                  />
                })
              }
            </div>
          )
        })
      }
    </>
  )
}

export default InfoPanelButtons;
