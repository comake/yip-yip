const appSpecificSettingsByDomain = {};

const importAll = (requireContext) => {
  return requireContext.keys().forEach(key => {
    const appSpecificSettings = requireContext(key)
    appSpecificSettingsByDomain[appSpecificSettings.domain] = appSpecificSettings;
  })
}

importAll(require.context('../data/app_specific_settings', false, /.json$/));

class AppSpecificSettings {
  static getSettingsForDomain(domain) {
    return appSpecificSettingsByDomain[domain] || [];
  }
}

export default AppSpecificSettings
