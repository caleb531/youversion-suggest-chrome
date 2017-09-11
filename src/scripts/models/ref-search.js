import Core from './core';
import RefSearchQuery from './ref-search-query.js';

class RefSearch {

  constructor() {
    this.bible = Core.getBibleData();
    this.chapters = Core.getChapterData();
  }

  // Search the Bible by reference name (e.g. "1 Corinthians 13:4-7"); return a
  // list of search results as JSON
  search(queryStr) {

    const results = [];
    // Build a query object containing the individual parts of the query string
    const query = new RefSearchQuery(queryStr);
    // Ensure that bible/chapter data has loaded, then proceed to search for
    // Bible references matching the given query
    return Promise.all([this.bible, this.chapters]).then(([bible, chapters]) => {
      const matchingBooks = this.getBooksMatchingQuery(bible.books, query);
      if (!query.chapter) {
        query.chapter = 1;
      }
      // Temporarily make the version always the same
      const chosenVersion = this.chooseBestVersion(bible.versions, bible.default_version, query);
      matchingBooks.forEach((book) => {
        // Ensure that chapter numbers are not out of range
        if (query.chapter <= chapters[book.id]) {
          results.push(this.getSearchResult(book, query, chosenVersion));
        }
      });
      return new Promise((resolve) => {
        resolve(results);
      });
    });

  }

  // Filter a list of Bible books to only those matching the given query book
  getBooksMatchingQuery(books, query) {
    const matchingBooks = books.filter((book) => {
      const bookName = Core.normalizeQueryStr(book.name);
      return bookName.startsWith(query.book);
    });
    return matchingBooks;
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
      const versionName = Core.normalizeQueryStr(version.name);
      return versionName.startsWith(query.version);
    });
  }

  // Build the JSON for a search result
  getSearchResult(book, query, version) {

    const result = {};

    result.uid = `${version.id}/${book.name}.${query.chapter}`;
    result.title = `${book.name} ${query.chapter}`;
    result.subtitle = 'View on YouVersion';
    if (query.verse) {
      result.uid += `.${query.verse}`;
      result.title += `:${query.verse}`;
    }
    if (query.endverse && query.endverse > query.verse) {
      result.uid += `-${query.endverse}`;
      result.title += `-${query.endverse}`;
    }
    result.title += ` (${version.name})`;

    return result;

  }

}

export default RefSearch;
