import Core from './core';

// A search result for a Bible reference search
class RefResult {

  // Build the JSON for a search result
  constructor(book, query, version) {

    this.uid = `${version.id}/${book.id}.${query.chapter}`;
    this.title = `${book.name} ${query.chapter}`;
    this.subtitle = 'View on YouVersion';
    if (query.verse) {
      this.uid += `.${query.verse}`;
      this.title += `:${query.verse}`;
    }
    if (query.endVerse && query.endVerse > query.verse) {
      this.uid += `-${query.endVerse}`;
      this.title += `-${query.endVerse}`;
    }
    this.title += ` (${version.name})`;

  }

  // View this reference result on the YouVersion website
  view() {
    window.open(`${Core.baseURL}/${this.uid.toUpperCase()}`);
  }

}

export default RefResult;