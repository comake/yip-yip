import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { YIPYIP_CONTAINER_DEFAULT_EDGE_MARGIN, YIPYIP_CONTAINER_HEIGHT, YIPYIP_CONTAINER_WIDTH } from './constants.js'
import Utils from './utils.js'
import DragHandle from './drag_handle.js'

const CONTAINER_DRAG_TYPE = 'yipyip-container';
const MINIMUM_VISIBLE_HORIZONTAL_MARGIN = 100;
const MINIMUM_VISIBLE_VERTICAL_MARGIN = 40;
const RIGHT_VALUE_MIN = -YIPYIP_CONTAINER_WIDTH + MINIMUM_VISIBLE_HORIZONTAL_MARGIN;
const BOTTOM_VALUE_MIN = -YIPYIP_CONTAINER_HEIGHT + MINIMUM_VISIBLE_VERTICAL_MARGIN;

const DraggableContainer = (props) => {
  const { children } = props;

  const [position, setPosition] = React.useState({
    bottom: YIPYIP_CONTAINER_DEFAULT_EDGE_MARGIN,
    right: YIPYIP_CONTAINER_DEFAULT_EDGE_MARGIN
  })

  const [{ isDragging }, dragRef, previewRef] = useDrag(() => ({
		type: CONTAINER_DRAG_TYPE,
		item: { id: 'yipyip-container' },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	}), [position])

  const [, drop] = useDrop(() => ({
		accept: CONTAINER_DRAG_TYPE,
		drop(item, monitor) {
			const delta = monitor.getDifferenceFromInitialOffset();
      const right = Math.round(position.right - delta.x);
      const bottom = Math.round(position.bottom - delta.y)
	    setPosition({
        right: Utils.clampNumber(right, RIGHT_VALUE_MIN, window.innerWidth - MINIMUM_VISIBLE_HORIZONTAL_MARGIN),
        bottom: Utils.clampNumber(bottom, BOTTOM_VALUE_MIN, window.innerHeight - MINIMUM_VISIBLE_VERTICAL_MARGIN),
      })
			return undefined
		},
	}), [position])

  const containerStyle = React.useMemo(() => {
    return {
      ...position,
      height: YIPYIP_CONTAINER_HEIGHT,
      width: YIPYIP_CONTAINER_WIDTH,
      opacity: isDragging ? 0 : 1
    }
  }, [position, isDragging])

  return (
    <div ref={drop} id={'yipyip-drag-container'} class={isDragging ? 'dragging' : ''}>
      <div ref={previewRef} id={'yipyip-container'} style={containerStyle}>
        <DragHandle dragRef={dragRef} />
        {children}
      </div>
    </div>
  )
}

export default DraggableContainer
