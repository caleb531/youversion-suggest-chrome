import copy from 'copy-to-clipboard';
import RefContentFetcher from './ref-content-fetcher.js';

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
    let matches = id.match(this.constructor.idPattern);
    this.name = name;
    this.id = id;
    this.content = content;
    this.version = Number(matches[2]);
    this.book = matches[3];
    this.chapter = Number(matches[4]);
    if (matches[5]) {
      this.verse = Number(matches[5]);
    }
    if (matches[6]) {
      this.endVerse = Number(matches[6]);
    }
  }

  // View this reference result on the YouVersion website
  view() {
    window.open(`${this.constructor.baseURL}/${this.id.toUpperCase()}`);
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

  // Build the direct URL to this reference's corresponding chapter
  getChapterURL() {
    let baseURL = this.constructor.baseURL;
    let {version, book, chapter} = this;
    return `${baseURL}/${version}/${book.toUpperCase()}.${chapter}`;
  }

  // Retrieve the reference ID from the given URL
  static getIDFromURL(url) {
    let matches = url.match(this.idPattern);
    return matches[1];
  }

}

// The base URL for Bible references on the YouVersion website
Reference.baseURL = 'https://www.bible.com/bible';
// The pattern to match a reference ID anywhere in a string
Reference.idPattern = /((\d+)\/([1-3a-z]{3})\.(\d+)(?:\.(\d+)(?:-(\d+))?)?)/;

export default Reference;
