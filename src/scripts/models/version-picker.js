import Core from './core';

class VersionPicker {

  constructor({preferences}) {
    this.versions = [];
    this.preferences = preferences;
  }

  getVersions() {
    return Core.getBibleLanguageData(this.preferences.language)
      .then((bible) => {
        this.versions = bible.versions;
      }).catch((error) => {
        console.error(error);
      });
  }

}

export default VersionPicker;
