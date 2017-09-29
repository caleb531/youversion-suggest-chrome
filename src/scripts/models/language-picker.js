import Core from './core';

class LanguageSelector {

  constructor() {
    this.languages = [];
  }

  getLanguages() {
    return Core.getJSON('data/languages/languages.json')
      .then((languages) => {
        this.languages = languages;
      }).catch((error) => {
        console.error(error);
        throw error;
      });
  }

}

export default LanguageSelector;
