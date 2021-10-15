import InfoPanelSettingRow from './info_panel_setting_row.js';

const InfoPanelSettings = (props) => {
  const { autoHide, toggleAutoHide, useOnEveryWebsite, toggleUseOnEveryWebsite,
    alwaysOn, toggleAlwaysOn
  } = props;

  const settings = [
    {
      label: 'Use on all websites (Experimental)',
      description: 'YipYip is currently optimized for Gmail and may be buggy on other websites.',
      value: useOnEveryWebsite,
      onChange: toggleUseOnEveryWebsite
    },
    {
      label: 'Always on',
      description: 'Focus the YipYip searchbar anytime you press any key if another input is not focused.',
      value: alwaysOn,
      onChange: toggleAlwaysOn
    },
    {
      label: 'Autohide',
      description: 'Hide the YipYip searchbar when not searching.',
      value: autoHide,
      onChange: toggleAutoHide
    }
  ]

  return (
    <>
      { settings.map(setting => {
          return <InfoPanelSettingRow key={setting.label} {...setting} />
        })
      }
    </>
  )

}

export default InfoPanelSettings;
