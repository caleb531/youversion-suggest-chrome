import Core from './core';

// A search result for a Bible reference search
class RefResult {

  // Build the JSON for a search result
  constructor({title, subtitle, uid, book, query, version}) {

    if (book && query && version) {
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
    } else {
      this.title = title;
      this.subtitle = subtitle;
      this.uid = uid;
    }

  }

  // View this reference result on the YouVersion website
  view() {
    window.open(`${Core.baseRefURL}/${this.uid.toUpperCase()}`);
  }

}

export default RefResult;
