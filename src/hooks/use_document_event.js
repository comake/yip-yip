import React from 'react';

function useDocumentEvent(effect, conditional, callback, capture=false) {
  return React.useEffect((conditional
    ? () => {
        document.addEventListener(effect, callback, capture)
        return () => document.removeEventListener(effect, callback, capture)
      }
    : () => {}
  ), [conditional, callback])
}

export default useDocumentEvent
