import React from 'react';
import useHover from '../hooks/use_hover.js'
import InfoPanel from './info_panel/info_panel.js';
import Tooltip from './tooltip.js';
import HelpIcon from './icons/help.js';

const InfoDropdown = (props) => {
  const containerRef = React.useRef();
  const [hover, onMouseEnter, onMouseLeave] = useHover();

  return (
    <div
      id={'yipyip-info-dropdown-button'}
      class={'yipyip-icon-button'}
      ref={containerRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <HelpIcon />
      { hover && (
          <Tooltip containerRef={containerRef}>
            <InfoPanel />
          </Tooltip>
        )
      }
    </div>
  )
}

export default InfoDropdown
