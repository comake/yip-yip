import React from 'react';

const InfoPanelSectionHeader = (props) => {
  const { text, marginTop } = props;

  const classes = React.useMemo(() => {
    return ['yipyip-info-panel-section-header']
      .concat(marginTop ? ['yipyip-info-panel-margin-top-section-header'] : [])
      .join(' ')
  }, [marginTop])

  return <div class={classes}>{text}</div>
}

export default InfoPanelSectionHeader;
