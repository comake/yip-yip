import React from 'react';
import useHover from '../../hooks/use_hover.js'
import InfoPanel from './info_panel/info_panel.js';
import Tooltip from './tooltip.js';
import { ReactComponent as HelpIcon } from '../../icons/help.svg';
import TemporarilyEnabledMessage from './temporarily_enabled_message.js';

const InfoDropdown = (props) => {
  const { autoHide, toggleAutoHide, useOnEveryWebsite, toggleUseOnEveryWebsite, temporarilyEnabled } = props;
  const containerRef = React.useRef();
  const [hover, onMouseEnter, onMouseLeave] = useHover();

  let tooltipContents;
  if (hover) {
    tooltipContents = (
      <InfoPanel
        autoHide={autoHide}
        toggleAutoHide={toggleAutoHide}
        useOnEveryWebsite={useOnEveryWebsite}
        toggleUseOnEveryWebsite={toggleUseOnEveryWebsite}
      />
    )
  } else if (temporarilyEnabled) {
    tooltipContents = <TemporarilyEnabledMessage />
  }

  return (
    <div
      id={'yipyip-info-dropdown-button'}
      class={'yipyip-icon-button'}
      ref={containerRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <HelpIcon />
      { tooltipContents && (
          <Tooltip containerRef={containerRef} key={hover ? 'hover' : temporarilyEnabled}>
            {tooltipContents}
          </Tooltip>
        )
      }
    </div>
  )
}

export default InfoDropdown
