import React from 'react';

function useWindowEvent(effect, conditional, callback) {
  return React.useEffect((conditional
    ? () => {
        window.addEventListener(effect, callback)
        return () => window.removeEventListener(effect, callback)
      }
    : () => {}
  ), [conditional, callback])
}

export default useWindowEvent;
