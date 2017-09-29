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

  // Retrieve the Bible data for the current language (English for now)
  static getBibleLanguageData() {
    return this.getJSON('data/languages/language-eng.json');
  }

  // Retrieve an object of YouVersion book IDs mapped to the number of chapters
  // in each
  static getBibleChapterData() {
    return this.getJSON('data/languages/chapters.json');
  }

  // Retrieve the full list of supported languages
  static getLanguages() {
    return Core.getJSON('data/languages/languages.json');
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

  // Retrieve all relevant Bible data used by the extension
  static getAllBibleData() {
    return Promise.all([
      this.getBibleLanguageData(),
      this.getBibleChapterData()
    ]);
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

  // Retrieve the reference UID from the given URL
  static getUIDFromURL(url) {
    let matches = url.match(Core.refUIDPattern);
    return matches[1];
  }

  // Retrieve the individual parts of the given reference UID
  static getUIDParts(uid) {
    let matches = uid.match(Core.refUIDPattern);
    let parts = {};
    parts.version = Number(matches[2]);
    parts.book = matches[3];
    parts.chapter = Number(matches[4]);
    if (matches[5]) {
      parts.verse = Number(matches[5]);
    }
    if (matches[6]) {
      parts.endVerse = Number(matches[6]);
    }
    return parts;

  }

}

// The base URL for Bible references on the YouVersion website
Core.baseRefURL = 'https://www.bible.com/bible';
Core.refUIDPattern = /((\d+)\/([1-3a-z]{3})\.(\d+)(?:\.(\d+)(?:\-(\d+))?)?)/;

export default Core;
