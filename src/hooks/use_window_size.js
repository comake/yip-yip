import React from 'react';
import useWindowEvent from './use_window_event.js';

function getWindowDimensions() {
  return { height: window.innerHeight, width: window.innerWidth }
}

const useWindowSize = (listen=true, timeoutDuration=0) => {
  const [windowSize, setWindowSize] = React.useState(getWindowDimensions())
  const resizeTimeout = React.useRef();

  const resize = React.useCallback(() => {
    if (resizeTimeout.current) { clearTimeout(resizeTimeout.current) }

    if (timeoutDuration === 0) {
      setWindowSize(getWindowDimensions())
    } else {
      resizeTimeout.current = setTimeout(() => setWindowSize(getWindowDimensions()), timeoutDuration);
    }
  }, [timeoutDuration])

  React.useEffect(() => {
    if (listen) {
      setWindowSize(getWindowDimensions())
    }
  }, [listen])

  useWindowEvent('resize', listen, resize)

  return windowSize
}

export default useWindowSize;
