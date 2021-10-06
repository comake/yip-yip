import React from 'react';
import useHover from '../hooks/use_hover.js'
import Tooltip from './tooltip.js';
import EyeIcon from './icons/eye.js';

const VisibilityButton = (props) => {
  const { hide } = props;
  const containerRef = React.useRef();
  const [hover, onMouseEnter, onMouseLeave] = useHover();

  return (
    <div
      id={'yipyip-visibility-button'}
      class={'yipyip-icon-button'}
      ref={containerRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={hide}
    >
      <EyeIcon />
      { hover && (
          <Tooltip containerRef={containerRef}>
            <div id={'yipyip-visibility-tooltip'}>
              <div>Turn YipYip off</div>
              <div id={'yipyip-visibility-tooltip-keyboard-shortcuts'}>
                <div class={'yipyip-info-panel-shortcut-key'}>Option</div>
                <div class={'yipyip-info-panel-shortcut-key'}>Escape</div>
              </div>
            </div>
          </Tooltip>
        )
      }
    </div>
  )
}

export default VisibilityButton;
