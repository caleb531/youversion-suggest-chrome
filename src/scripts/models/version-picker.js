import Core from './core';

class VersionPicker {

  constructor({preferences}) {
    this.options = [];
    this.preferences = preferences;
  }

  getOptions() {
    return Core.getBibleLanguageData(this.preferences.language)
      .then((bible) => {
        this.options = bible.versions;
        this.defaultOption = bible.default_version;
      });
  }

  setOption(version) {
    return new Promise((resolve) => {
      this.preferences.version = version;
      chrome.storage.sync.set({preferences: this.preferences}, resolve);
    });
  }

}

export default VersionPicker;
