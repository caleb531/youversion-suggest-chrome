import Core from './core';

class LanguagePicker {

  constructor() {
    this.languages = [];
    this.preferredLanguage = null;
  }

  loadLanguages() {
    return Core.getLanguages()
      .then((languages) => {
        this.languages = languages;
        return languages;
      });
  }

  loadPreferredLanguage() {
    return Core.getPreferences().then((prefs) => {
      this.preferredLanguage = prefs.language;
      return this.preferredLanguage;
    });
  }

  setPreferredLanguage(newLanguage) {
    this.preferredLanguage = newLanguage;
    return Core.setPreferences({language: newLanguage});
  }

}

export default LanguagePicker;
