import { getLanguages } from 'youversion-suggest';
import { getPreferences, setPreferences } from './preferences.js';

class LanguagePicker {
  constructor() {
    this.languages = [];
    this.preferredLanguage = null;
  }

  async loadLanguages() {
    const languages = await getLanguages();
    this.languages = languages;
    return languages;
  }

  async loadPreferredLanguage() {
    const prefs = await getPreferences();
    this.preferredLanguage = prefs.language;
    return this.preferredLanguage;
  }

  setPreferredLanguage(newLanguage) {
    this.preferredLanguage = newLanguage;
    return setPreferences({ language: newLanguage });
  }
}

export default LanguagePicker;
