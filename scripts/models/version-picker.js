import { getBibleData } from 'youversion-suggest';
import { getPreferences, setPreferences } from './preferences.js';

class VersionPicker {
  constructor() {
    this.versions = [];
    this.preferredVersion = null;
  }

  async loadVersions({ language }) {
    const bible = await getBibleData(language);
    this.versions = bible.versions;
    this.defaultVersion = bible.default_version;
  }

  async loadPreferredVersion() {
    const prefs = await getPreferences();
    this.preferredVersion = prefs.version;
    return this.preferredVersion;
  }

  setPreferredVersion(newVersion) {
    this.preferredVersion = newVersion;
    return setPreferences({ version: newVersion });
  }
}

export default VersionPicker;
