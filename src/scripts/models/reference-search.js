import Core from './core';
import ReferenceSearchQuery from './reference-search-query.js';

class ReferenceSearch {

  constructor() {
    this.bible = Core.getBibleData();
    this.chapters = Core.getChapterData();
  }

  // Search the Bible by reference name (e.g. "1 Corinthians 13:4-7"); return a
  // list of search results as JSON
  search(queryStr) {

    const results = [];
    // Build a query object containing the individual parts of the query string
    const query = new ReferenceSearchQuery(queryStr);
    // Ensure that bible/chapter data has loaded, then proceed to search for
    // Bible references matching the given query
    return Promise.all([this.bible, this.chapters]).then(([bible, chapters]) => {
      const matchingBooks = this.getBooksMatchingQuery(bible.books, query);
      if (!query.chapter) {
        query.chapter = 1;
      }
      // Temporarily make the version always the same
      const chosenVersion = bible.versions[0];
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

  // Build the JSON for a search result
  getSearchResult(book, query, version) {

    const result = {};

    result.uid = `${book.name}.${query.chapter}`;
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
    result.uid = `${version.id}/${result.uid}`;

    return result;

  }

}

export default ReferenceSearch;
