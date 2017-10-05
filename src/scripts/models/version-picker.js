import Core from './core';

class VersionPicker {

  constructor() {
    this.versions = [];
    this.preferredVersion = null;
  }

  loadVersions({language}) {
    return Core.getBibleLanguageData(language)
      .then((bible) => {
        this.versions = bible.versions;
        this.defaultVersion = bible.default_version;
      });
  }

  loadPreferredVersion() {
    return Core.getPreferences().then((prefs) => {
      this.preferredVersion = prefs.version;
      return this.preferredVersion;
    });
  }

  setPreferredVersion(newVersion) {
    this.preferredVersion = newVersion;
    return Core.setPreferences({version: newVersion});
  }

}

export default VersionPicker;
