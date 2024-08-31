import {getBibleLanguageData} from './bible.js';
import {getPreferences, setPreferences} from './preferences.js';

class VersionPicker {

  constructor() {
    this.versions = [];
    this.preferredVersion = null;
  }

  loadVersions({language}) {
    return getBibleLanguageData(language)
      .then((bible) => {
        this.versions = bible.versions;
        this.defaultVersion = bible.default_version;
      });
  }

  loadPreferredVersion() {
    return getPreferences().then((prefs) => {
      this.preferredVersion = prefs.version;
      return this.preferredVersion;
    });
  }

  setPreferredVersion(newVersion) {
    this.preferredVersion = newVersion;
    return setPreferences({version: newVersion});
  }

}

export default VersionPicker;
