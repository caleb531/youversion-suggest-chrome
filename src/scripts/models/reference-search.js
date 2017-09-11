import Core from './core';
import ReferenceSearchQuery from './reference-search-query.js';

class ReferenceSearch {

  constructor() {
    this.bible = Core.getBibleData();
  }

  // Search the Bible by reference name (e.g. "1 Corinthians 13:4-7")
  search(queryStr) {

    // Build a query object containing the individual parts of the query string
    let query = new ReferenceSearchQuery(queryStr);

  }

}

export default ReferenceSearch;
