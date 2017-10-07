import m from 'mithril';

// The core back-end model consisting of shared functions and data
class Core {

  // Fetch the HTML contents at the given URL (with the given GET parameters)
  static getHTML(baseURL, getParams) {
    return m.request({
      url: baseURL,
      data: getParams,
      // By default, Mithril will try to parse response as JSON; return raw data
      // instead, since we are expecting HTML
      deserialize: (content) => content,
      // Do not redraw views after request completion
      background: true
    });
  }

  // Fetch any arbitrary JSON data via the given data file path
  static getJSON(dataFilePath) {
    return m.request({
      url: dataFilePath,
      // Again, no need to redraw upon completion
      background: true
    });
  }

  // Retrieve the Bible data for the given language
  static getBibleLanguageData(language) {
    return this.getJSON(`data/bible/language-${language}.json`);
  }

  // Retrieve an object of YouVersion book IDs mapped to the number of chapters
  // in each
  static getBibleChapterData() {
    return this.getJSON('data/bible/chapters.json');
  }

  // Retrieve the full list of supported languages
  static getLanguages() {
    return Core.getJSON('data/bible/languages.json');
  }

  // Retrieve the raw user preferences without defaults merged in
  static getRawPreferences() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['preferences'], (items) => {
        resolve(items.preferences);
      });
    });
  }

  // Retrieve the map of default values for user preferences
  static getDefaultPreferences() {
    return Core.getJSON('data/preferences/defaults.json');
  }

  // Get the final preferences object (stored user data merged with defaults)
  static getPreferences() {
    return Promise.all([
      this.getDefaultPreferences(),
      this.getRawPreferences(),
    ])
    .then(([defaultPrefs, rawPrefs]) => {
      return Object.assign({}, defaultPrefs, rawPrefs);
    });
  }

  // Merge the given preferences into the persisted user preferences object
  static setPreferences(prefsToUpdate) {
    return this.getPreferences()
      .then((currentPrefs) => {
        let newPrefs = Object.assign(currentPrefs, prefsToUpdate);
        return new Promise((resolve) => {
          chrome.storage.sync.set({preferences: newPrefs}, () => {
            resolve(newPrefs);
          });
        });
      });
  }

  // Change the query string to be in a consistent format
  static normalizeQueryStr(queryStr) {
    queryStr = queryStr.toLowerCase();
    // Remove all non-alphanumeric characters
    queryStr = queryStr.replace(/[\W_]/gi, ' ', queryStr);
    // Remove extra whitespace
    queryStr = queryStr.trim();
    queryStr = queryStr.replace(/\s+/g, ' ', queryStr);
    // Parse shorthand reference notation
    queryStr = queryStr.replace(/(\d)(?=[a-z])/, '$1 ', queryStr);
    return queryStr;
  }

}

export default Core;
