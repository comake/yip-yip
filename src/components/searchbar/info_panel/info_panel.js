import InfoPanelHowToSteps from './info_panel_how_to_steps.js';
import InfoPanelKeyboardShortcuts from './info_panel_keyboard_shortcuts.js';
import InfoPanelButtons from './info_panel_buttons.js';
import InfoPanelSectionHeader from './info_panel_section_header.js';
import InfoPanelSettings from './info_panel_settings.js';

import { COMAKE_LANDING_PAGE_LINK } from '../../../constants.js';

const InfoPanel = (props) => {
  const { autoHide, toggleAutoHide, useOnEveryWebsite, toggleUseOnEveryWebsite } = props;

  const madeWithLoveHeader = <>
    Made with ❤️ by <a id={'yipyip-comake-link'} href={COMAKE_LANDING_PAGE_LINK} target='_blank' rel="noreferrer">COMAKE</a>
  </>;

  return (
    <div id={'yipyip-info-panel'}>
      <InfoPanelSectionHeader text={'How to use YipYip!'} />
      <InfoPanelHowToSteps />
      <InfoPanelSectionHeader marginTop text={'Keyboard Shortcuts'} />
      <InfoPanelKeyboardShortcuts />
      <InfoPanelSectionHeader marginTop text={'Settings'} />
      <InfoPanelSettings
        autoHide={autoHide}
        toggleAutoHide={toggleAutoHide}
        useOnEveryWebsite={useOnEveryWebsite}
        toggleUseOnEveryWebsite={toggleUseOnEveryWebsite}
      />
      <InfoPanelSectionHeader marginTop text={madeWithLoveHeader} />
      <InfoPanelButtons />
    </div>
  )
}

export default InfoPanel;
