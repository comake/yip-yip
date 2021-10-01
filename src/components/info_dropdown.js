import React from 'react';
import useHover from '../hooks/use_hover.js'
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
      ?
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
