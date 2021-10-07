const InfoPanelRow = (props) => {
  return (
    <div class={`yipyip-info-panel-row ${props.classes}`}>
      {props.children}
    </div>
  )
}

export default InfoPanelRow;
