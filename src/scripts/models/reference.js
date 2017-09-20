import Core from './core';

// A search result for a Bible reference search
class Reference {

  // Build the JSON for a search result
  constructor({name, uid, book, query, version, content}) {

    if (book && query && version) {
      this.uid = `${version.id}/${book.id}.${query.chapter}`;
      this.book = book;
      this.name = `${book.name} ${query.chapter}`;
      if (query.verse) {
        this.uid += `.${query.verse}`;
        this.name += `:${query.verse}`;
        this.verse = query.verse;
      }
      if (query.endVerse && query.endVerse > query.verse) {
        this.uid += `-${query.endVerse}`;
        this.name += `-${query.endVerse}`;
        this.endVerse = query.endVerse;
      }
      this.name += ` (${version.name})`;
      this.version = version;
    } else {
      this.name = name;
      this.uid = uid;
      if (content) {
        this.content = content;
      }
    }

  }

  // View this reference result on the YouVersion website
  view() {
    window.open(`${Core.baseRefURL}/${this.uid.toUpperCase()}`);
  }

}

export default Reference;
