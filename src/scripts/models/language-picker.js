import Core from './core';

class LanguagePicker {

  constructor({preferences}) {
    this.options = [];
    this.preferences = preferences;
  }

  getOptions() {
    return Core.getLanguages()
      .then((languages) => {
        this.options = languages;
      });
  }

  setOption(language) {
    return new Promise((resolve) => {
      this.preferences.language = language;
      // Every time the language is changed, the version is updated to the default
      // version of the newly-set language
      delete this.preferences.version;
      chrome.storage.sync.set({preferences: this.preferences}, resolve);
    });
  }

}

export default LanguagePicker;
