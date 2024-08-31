import { getPreferences, setPreferences } from './preferences.js';
import { getBibleData } from 'youversion-suggest';

class VersionPicker {
  constructor() {
    this.versions = [];
    this.preferredVersion = null;
  }

  loadVersions({ language }) {
    return getBibleData(language).then((bible) => {
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
    return setPreferences({ version: newVersion });
  }
}

export default VersionPicker;
