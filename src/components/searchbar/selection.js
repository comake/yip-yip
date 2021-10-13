import React from 'react';

const SELECTION_MARGIN = 7;

const Selection = (props) => {
  const { node, isSelected } = props;

  const classes = React.useMemo(() => {
    return ['yipyip-selection']
      .concat(isSelected ? ['yipyip-selected-selection'] : [])
      .join(' ')
  }, [isSelected])

  const nodeBounds = React.useMemo(() => node.getBoundingClientRect(), [node])

  const style = React.useMemo(() => {
    const left = nodeBounds.left - SELECTION_MARGIN;
    const top = nodeBounds.top - SELECTION_MARGIN;
    // Don't allow the selection box to go off top or left of screen
    const maximizedLeft = isSelected ? Math.max(0, left) : left;
    const maximizedTop = isSelected ? Math.max(0, top) : top;

    const maximizedTopDifference = (maximizedTop - top);
    const maximizedLeftDifference = (maximizedLeft - left);

    const height = nodeBounds.height + (2*SELECTION_MARGIN) - maximizedTopDifference;
    const width = nodeBounds.width + (2*SELECTION_MARGIN) - maximizedLeftDifference;

    // TODO: Dont allow selection box to go off bottom or right of screen
    return {
      left: maximizedLeft,
      top: maximizedTop,
      height: height,
      width: width,
    }
  }, [nodeBounds, isSelected])

  return <div class={classes} style={style}></div>
}

export default Selection;
