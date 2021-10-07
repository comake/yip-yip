import React from 'react';
import { YIPYIP_CONTAINER_DEFAULT_EDGE_MARGIN, YIPYIP_CONTAINER_HEIGHT, YIPYIP_CONTAINER_WIDTH } from '../constants.js'
import Utils from '../lib/utils.js'
import DragHandle from './drag_handle.js'

const RIGHT_VALUE_MIN = 0;
const BOTTOM_VALUE_MIN = 0

const DraggableContainer = (props) => {
  const { children, searchInputRef, containerRef } = props;

  const [isDragging, setIsDragging] = React.useState(false)
  const [dragOffset, setDragOffset] = React.useState(null)
  const [position, setPosition] = React.useState({
    bottom: YIPYIP_CONTAINER_DEFAULT_EDGE_MARGIN,
    right: YIPYIP_CONTAINER_DEFAULT_EDGE_MARGIN
  })

  const onDragStart = React.useCallback(event => {
    if (!(event.target === searchInputRef.current && searchInputRef.current.value.length > 0) && !event.metaKey) {
      event.preventDefault();
      setDragOffset({
        x: window.innerWidth - position.right - event.clientX,
        y: window.innerHeight - position.bottom - event.clientY
      })
      setIsDragging(true)
    }
  }, [position])

  const onDragEnd = React.useCallback(event => {
    setIsDragging(false)
    if (event.target === searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  const drag = React.useCallback(event => {
    event.preventDefault();
    const newRight = window.innerWidth - event.clientX - dragOffset.x;
    const newBottom = window.innerHeight - event.clientY - dragOffset.y;
    setPosition({
      right: Utils.clampNumber(newRight, RIGHT_VALUE_MIN, window.innerWidth - YIPYIP_CONTAINER_WIDTH),
      bottom: Utils.clampNumber(newBottom, BOTTOM_VALUE_MIN, window.innerHeight - YIPYIP_CONTAINER_HEIGHT)
    })
  }, [dragOffset])

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', drag)
      document.addEventListener('mouseup', onDragEnd)

      return () => {
        document.removeEventListener('mousemove', drag)
        document.removeEventListener('mouseup', onDragEnd)
      }
    }
  }, [isDragging, drag, onDragEnd])

  const containerStyle = React.useMemo(() => {
    return {
      ...position,
      height: YIPYIP_CONTAINER_HEIGHT,
      width: YIPYIP_CONTAINER_WIDTH
    }
  }, [position])

  return (
    <div
      id={'yipyip-container'}
      style={containerStyle}
      onMouseDown={onDragStart}
      ref={containerRef}
    >
      <DragHandle />
      {children}
    </div>
  )
}

export default DraggableContainer
