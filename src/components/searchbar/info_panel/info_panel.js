import InfoPanelKeyboardShortcuts from './info_panel_keyboard_shortcuts.js';
import InfoPanelButtons from './info_panel_buttons.js';
import InfoPanelSectionHeader from './info_panel_section_header.js';
import InfoPanelSettings from './info_panel_settings.js';
import InfoPanelRow from './info_panel_row.js';

import { COMAKE_LANDING_PAGE_LINK, YIPYIP_WELCOME_LINK } from '../../../constants.js';

const InfoPanel = (props) => {
  const { autoHide, toggleAutoHide, useOnEveryWebsite, toggleUseOnEveryWebsite,
    alwaysOn, toggleAlwaysOn
  } = props;

  const madeWithLoveHeader = <>
    Made with ❤️ by <a id={'yipyip-comake-link'} href={COMAKE_LANDING_PAGE_LINK} target='_blank' rel="noreferrer">COMAKE</a>
  </>;

  const learnHowLink = <a id={'yipyip-learn-how-link'} href={YIPYIP_WELCOME_LINK} target='_blank'>Learn how to use YipYip</a>;

  return (
    <div id={'yipyip-info-panel'}>
      <InfoPanelRow>{learnHowLink}</InfoPanelRow>
      <InfoPanelSectionHeader marginTop text={'Keyboard Shortcuts'} />
      <InfoPanelKeyboardShortcuts />
      <InfoPanelSectionHeader marginTop text={'Settings'} />
      <InfoPanelSettings
        autoHide={autoHide}
        toggleAutoHide={toggleAutoHide}
        useOnEveryWebsite={useOnEveryWebsite}
        toggleUseOnEveryWebsite={toggleUseOnEveryWebsite}
        alwaysOn={alwaysOn}
        toggleAlwaysOn={toggleAlwaysOn}
      />
      <InfoPanelSectionHeader marginTop text={madeWithLoveHeader} />
      <InfoPanelButtons />
    </div>
  )
}

export default InfoPanel;
