import {getBibleLanguageData, getBibleChapterData} from './bible.js';
import {getPreferences} from './preferences.js';
import RefSearcherQuery from './ref-search-query.js';
import Reference from './reference.js';

// Functions for searching the Bible by reference
class RefSearcher {

  constructor() {
    this.preferences = getPreferences();
    this.allBibleData = Promise.all([
      // Retrieve the Bible data for the currently-set language
      this.preferences.then((preferences) => {
        return getBibleLanguageData(preferences.language);
      }),
      getBibleChapterData(),
      this.preferences.then((preferences) => preferences.version)
    ]);
  }

  // Search the Bible by reference name (e.g. "1 Corinthians 13:4-7"); return a
  // list of search results as JSON
  search(queryStr) {

    // Build a query object containing the individual parts of the query string
    let query = new RefSearcherQuery(queryStr);
    if (query.isEmpty()) {
      // Since a query string that doesn't look like a reference doesn't
      // strictly constitute an error, the promise should still resolve
      return Promise.resolve([]);
    }

    // Ensure that bible/chapter data has loaded, then proceed to search for
    // Bible references matching the given query
    return this.allBibleData
      .then(([bible, chapters, preferredVersion]) => {
        let matchingBooks = this.getBooksMatchingQuery(bible.books, query);
        let chosenVersion = this.chooseBestVersion(bible.versions, preferredVersion, query);
        return this.buildResultsFromData({chapters, matchingBooks, query, chosenVersion});
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });

  }

  // Perform a reference search using the fetched Bible/chapter data, as well as
  // the parsed query
  buildResultsFromData({chapters, matchingBooks, query, chosenVersion}) {

    let results = [];
    matchingBooks.forEach((book) => {
      // Ensure that chapter numbers are not out of range
      if (query.chapter <= chapters[book.id]) {
        results.push(new Reference({
          book: book,
          query: query,
          version: chosenVersion
        }));
      }
    });
    return results;

  }

  // Filter a list of Bible books to only those matching the given query book
  getBooksMatchingQuery(books, query) {
    return books.filter((book) => {
      let bookName = RefSearcherQuery.normalizeQueryStr(book.name);
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
      let versionName = RefSearcherQuery.normalizeQueryStr(version.name);
      return versionName.startsWith(query.version);
    });
  }

}

export default RefSearcher;
