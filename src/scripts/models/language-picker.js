import Core from './core';

class LanguagePicker {

  constructor({preferences}) {
    this.languages = [];
    this.preferences = preferences;
  }

  getLanguages() {
    return Core.getLanguages()
      .then((languages) => {
        this.languages = languages;
      }).catch((error) => {
        console.error(error);
        throw error;
      });
  }

}

export default LanguagePicker;
