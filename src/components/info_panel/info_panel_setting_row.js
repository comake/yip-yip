import React from 'react';
import InfoPanelRow from './info_panel_row.js';

const InfoPanelSettingRow = (props) => {
  const { label, description, value, onChange } = props;

  return (
    <InfoPanelRow classes={'yipyip-info-panel-setting-row'}>
      <input
        class={'yipyip-info-panel-setting-checkbox'}
        type='checkbox'
        value={value ? "1" : "0"}
        checked={value}
        name={description}
        onChange={onChange}
      />
      <div class={'yipyip-info-panel-setting-text'}>
        <div class={'yipyip-info-panel-setting-header'}>{label}</div>
        <div class={'yipyip-info-panel-setting-description'}>{description}</div>
      </div>
    </InfoPanelRow>
  )
}

export default InfoPanelSettingRow;
