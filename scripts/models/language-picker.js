import {getPreferences, setPreferences} from './preferences.js';
import {getLanguages} from 'youversion-suggest';

class LanguagePicker {

  constructor() {
    this.languages = [];
    this.preferredLanguage = null;
  }

  loadLanguages() {
    return getLanguages()
      .then((languages) => {
        this.languages = languages;
        return languages;
      });
  }

  loadPreferredLanguage() {
    return getPreferences().then((prefs) => {
      this.preferredLanguage = prefs.language;
      return this.preferredLanguage;
    });
  }

  setPreferredLanguage(newLanguage) {
    this.preferredLanguage = newLanguage;
    return setPreferences({language: newLanguage});
  }

}

export default LanguagePicker;
