const DragHandle = (props) => {
  const { onMouseDown } = props;

  return (
    <div draggable onMouseDown={onMouseDown} id={'yipyip-drag-handle'}>
      { [...Array(3)].map((e, i) => {
          return (
            <div class={'yipyip-drag-handle-row'} key={i}>
              <div class={'yipyip-drag-handle-item'} />
              <div class={'yipyip-drag-handle-item'} />
            </div>
          )
        })
      }
    </div>
  )
}

export default DragHandle;
