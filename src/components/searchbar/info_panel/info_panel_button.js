const InfoPanelButton = (props) => {
  const { icon, text, link } = props;
  return (
    <a
      class={'yipyip-info-panel-button'}
      href={link}
      target='_blank'
      rel="noreferrer"
    >
      {icon} {text}
    </a>
  )
}

export default InfoPanelButton;
