const DragHandle = (props) => {
  return (
    <div id={'yipyip-drag-handle'}>
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
