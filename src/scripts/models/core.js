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

}

export default Core;
