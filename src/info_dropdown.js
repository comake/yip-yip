import React from 'react';
import useHover from './hooks/use_hover.js'
import KeyboardIcon from './keyboard_icon.js';
import InfoPanel from './info_panel.js';
import Tooltip from './tooltip.js';

const InfoDropdown = (props) => {
  const containerRef = React.useRef();
  const [hover, onMouseEnter, onMouseLeave] = useHover();

  return (
    <div
      id={'yipyip-info-dropdown-button'}
      ref={containerRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <KeyboardIcon />
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
