import m from 'mithril';

// The core back-end model consisting of shared functions and data
class Core {

  // Fetch any arbitrary JSON data via the given data file path
  static getJSON(dataFilePath) {
      return m.request({url: dataFilePath});
  }

  // Retrieve the Bible data for the current language (English for now)
  static getBibleData() {
    return this.getJSON('data/bible/language-eng.json');
  }

  // Retrieve an object of YouVersion book IDs mapped to the number of chapters
  // in each
  static getChapterData() {
    return this.getJSON('data/bible/chapters.json');
  }

  // Change the query string to be in a consistent format
  static normalizeQueryStr(queryStr) {
    queryStr - queryStr.toLowerCase();
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
