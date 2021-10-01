import React from 'react';
import Utils from './utils.js';
import Portal from './portal.js';
import useWindowSize from './hooks/use_window_size.js';

const ARROW_SIZE = 15;

const Tooltip = (props) => {
  const { children, containerRef } = props;

  const [hasMounted, setHasMounted] = React.useState(false);
  const panelRef = React.useRef();
  const arrowRef = React.useRef();

  const windowSize = useWindowSize(true, 100)

  const STYLE = React.useMemo(() => {
    if (!containerRef.current || !panelRef.current || !hasMounted) {
      return {
        panel: { opacity: 0 },
        arrow: { opacity: 0 }
      }
    } else {
      const countainerBounds = containerRef.current.getBoundingClientRect();
      const containerDistanceFromBottom = windowSize.height - countainerBounds.bottom;
      const panelBounds = panelRef.current.getBoundingClientRect();
      const totalTooltipHeight = panelBounds.height + ARROW_SIZE;

      let panelTop, arrowTop, arrowBorderWidth;
      if (totalTooltipHeight > containerDistanceFromBottom) {
        // Put tooltip above
        panelTop = countainerBounds.top - panelBounds.height - ARROW_SIZE;
        arrowTop = countainerBounds.top - ARROW_SIZE;
        arrowBorderWidth = `${ARROW_SIZE}px ${ARROW_SIZE}px 0 ${ARROW_SIZE}px`;
      } else {
        // Put tooltip below
        panelTop = countainerBounds.bottom + ARROW_SIZE;
        arrowTop = countainerBounds.bottom;
        arrowBorderWidth = `0 ${ARROW_SIZE}px ${ARROW_SIZE}px ${ARROW_SIZE}px`;
      }

      const centeredPanelLeft = Math.round(countainerBounds.left + (countainerBounds.width/2) - (panelBounds.width/2));
      const centeredArrowLeft = Math.round(countainerBounds.left + (countainerBounds.width/2) - ARROW_SIZE);

      const maxPanelLeft = windowSize.width - panelBounds.width;
      const panelLeft = Utils.clampNumber(centeredPanelLeft, 0, maxPanelLeft);

      const maxArrowLeft = windowSize.width - ARROW_SIZE;
      const arrowLeft = Utils.clampNumber(centeredArrowLeft, ARROW_SIZE, maxArrowLeft);

      return {
        panel: { left: panelLeft, top: panelTop },
        arrow: { left: arrowLeft, top: arrowTop, borderWidth: arrowBorderWidth }
      }
    }
  }, [hasMounted, windowSize, containerRef])

  React.useEffect(() => setHasMounted(true), [])

  return <>
    <Portal><div class={'yipyip-tooltip-panel'} style={STYLE.panel} ref={panelRef}>{children}</div></Portal>
    <Portal><div class={'yipyip-tooltip-arrow'} style={STYLE.arrow} ref={arrowRef}></div></Portal>
  </>
}

export default Tooltip
