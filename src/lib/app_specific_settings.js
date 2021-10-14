const appSpecificSettingsByHost = {};

const importAll = (requireContext) => {
  return requireContext.keys().forEach(key => {
    const appSpecificSettings = requireContext(key)
    appSpecificSettingsByHost[appSpecificSettings.host] = appSpecificSettings;
  })
}

importAll(require.context('../data/app_specific_settings', false, /.json$/));

class AppSpecificSettings {
  static getSettingsForHost(host) {
    return appSpecificSettingsByHost[host] || {};
  }
}

export default AppSpecificSettings
