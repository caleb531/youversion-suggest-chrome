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
      deserialize: (value) => value
    });
  }

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

// The base URL for Bible references on the YouVersion website
Core.baseURL = 'https://www.bible.com/bible';
Core.refUIDPattern = /\d+\/[a-z0-9]+\.\d+\.\d+/;
// The user agent to use when making external HTTP requests
Core.userAgent = 'YouVersion Suggest';

export default Core;
