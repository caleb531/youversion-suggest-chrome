import Core from './core';
import RefSearcherQuery from './ref-search-query.js';
import RefResult from './ref-result.js';

// Functions for searching the Bible by reference
class RefSearcher {

  constructor() {
    this.bible = Core.getBibleData();
    this.chapters = Core.getChapterData();
  }

  // Search the Bible by reference name (e.g. "1 Corinthians 13:4-7"); return a
  // list of search results as JSON
  search(queryStr) {

    let results = [];
    // Build a query object containing the individual parts of the query string
    let query = new RefSearcherQuery(queryStr);
    if (query.isEmpty()) {
      return Promise.reject();
    }
    // Ensure that bible/chapter data has loaded, then proceed to search for
    // Bible references matching the given query
    return Promise.all([this.bible, this.chapters]).then(([bible, chapters]) => {

      let matchingBooks = this.getBooksMatchingQuery(bible.books, query);
      if (!query.chapter) {
        query.chapter = 1;
      }

      // Temporarily make the version always the same
      let chosenVersion = this.chooseBestVersion(bible.versions, bible.default_version, query);
      matchingBooks.forEach((book) => {
        // Ensure that chapter numbers are not out of range
        if (query.chapter <= chapters[book.id]) {
          results.push(new RefResult({
            book: book,
            query: query,
            version: chosenVersion
          }));
        }
      });

      if (results.length > 0) {
        return Promise.resolve(results);
      } else {
        return Promise.reject();
      }
    });

  }

  // Filter a list of Bible books to only those matching the given query book
  getBooksMatchingQuery(books, query) {
    return books.filter((book) => {
      let bookName = Core.normalizeQueryStr(book.name);
      return bookName.startsWith(query.book);
    });
  }

  // Choose the most appropriate version based on the given parameters
  chooseBestVersion(versions, defaultVersionId, query) {

    let chosenVersion = null;

    if (query.version) {
      chosenVersion = this.guessVersion(versions, query);
    }
    // If no version could be guessed, use the default version
    if (!chosenVersion) {
      chosenVersion = versions.find(
        (version) => (version.id === defaultVersionId));
    }

    return chosenVersion;

  }

  // Find a version which best matches the version of the given query
  guessVersion(versions, query) {
    return versions.find((version) => {
      let versionName = Core.normalizeQueryStr(version.name);
      return versionName.startsWith(query.version);
    });
  }

}

export default RefSearcher;
