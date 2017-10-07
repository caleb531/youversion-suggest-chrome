import copy from 'copy-to-clipboard';
import Core from './core';
import RefContentFetcher from './ref-content-fetcher';

// A search result for a Bible reference search
class Reference {

  // Build the JSON for a search result
  constructor({name, id, content, query, book, version}) {

    if (name && id && content) {
      this.buildRefFromContentSearchData({name, id, content});
    } else if (query && book && version) {
      this.buildRefFromRefSearchData({book, query, version});
    } else {
      throw new Error('Invalid arguments to Reference() constructor');
    }

  }

  // Build reference object from the data provided by reference search results
  // (i.e. the query object, book data, and version data)
  buildRefFromRefSearchData({query, book, version}) {
    this.id = `${version.id}/${book.id}.${query.chapter}`;
    this.book = book.id;
    this.chapter = query.chapter;
    this.name = `${book.name} ${query.chapter}`;
    if (query.verse) {
      this.id += `.${query.verse}`;
      this.name += `:${query.verse}`;
      this.verse = query.verse;
    }
    if (query.endVerse && query.endVerse > query.verse) {
      this.id += `-${query.endVerse}`;
      this.name += `-${query.endVerse}`;
      this.endVerse = query.endVerse;
    }
    this.name += ` (${version.name})`;
    this.version = version.id;
  }

  // Build reference object from the data provided by content search results
  // (i.e. name, id, and content)
  buildRefFromContentSearchData({name, id, content}) {
    this.name = name;
    this.id = id;
    this.content = content;
    // Adds chapter, verse, and endVerse properties (respectively, if present)
    Object.assign(this, Core.getRefIDParts(id));
  }

  // View this reference result on the YouVersion website
  view() {
    window.open(`${Core.baseRefURL}/${this.id.toUpperCase()}`);
  }

  // Copy the full contents of this reference to the clipboard
  copy() {
    let contentFetcher = new RefContentFetcher(this);
    this.isCopyingContent = true;
    return contentFetcher.fetchContent()
      .then((refContent) => {
        this.isCopyingContent = false;
        copy(`${this.name}\n\n${refContent}`);
      })
      .catch((error) => {
        this.isCopyingContent = false;
        // Pass the error down the chain
        return Promise.reject(error);
      });
  }

  // Define the default action for any reference result
  runDefaultAction() {
    this.view();
  }

}

export default Reference;
