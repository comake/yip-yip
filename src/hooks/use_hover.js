import React from 'react';

const useHover = () => {
  const [hover, setHover] = React.useState(false)
  const onMouseEnter = React.useCallback(() => setHover(true), [])
  const onMouseLeave = React.useCallback(() => setHover(false), [])
  return [hover, onMouseEnter, onMouseLeave]
}

export default useHover;
