import React from 'react';
import useHover from '../hooks/use_hover.js'
import Tooltip from './tooltip.js';
import { ReactComponent as ShowIcon } from '../icons/show.svg';
import { ReactComponent as HideIcon } from '../icons/hide.svg';

const VisibilityButton = (props) => {
  const { autoHide, toggleAutoHide } = props;
  const containerRef = React.useRef();
  const [hover, onMouseEnter, onMouseLeave] = useHover();

  return (
    <div
      id={'yipyip-visibility-button'}
      class={'yipyip-icon-button'}
      ref={containerRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={toggleAutoHide}
    >
      {autoHide ? <ShowIcon /> : <HideIcon /> }
      { hover && (
          <Tooltip containerRef={containerRef}>
            <div id={'yipyip-visibility-tooltip'}>
              <div>{autoHide ? 'Turn Autohide off' : 'Turn Autohide on' }</div>
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
