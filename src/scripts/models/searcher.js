import debounce from 'debounce-promise';
import Core from './core';
import RefSearcher from './ref-searcher';
import ContentSearcher from './content-searcher';

// A generic class for performing several kinds of Bible searches via
// YouVersion; every Searcher instance can perform more than one search in its
// lifetime
class Searcher {

  // Initialize the Searcher with a callback to run whenever the internal search
  // results are updated
  constructor({onUpdateSearchStatus}) {

      this.queryStr = '';
      this.restoreSavedQueryStr();

      this.refSearcher = new RefSearcher();
      this.contentSearcher = new ContentSearcher();

      // The last-returned list search results
      this.results = [];
      this.selectedResultIndex = 0;
      this.loadingResults = false;
      this.onUpdateSearchStatus = onUpdateSearchStatus;

      this.debounceContentSearch();

  }

  // Only run a content search if the last content search was at least some
  // amount of time ago (specified by searchDelay)
  debounceContentSearch() {
    this.constructor.prototype.searchByContent = debounce(this.constructor.prototype.searchByContent, this.constructor.searchDelay);
  }

  // Retrieve the last-searched query from the extension's local data store
  restoreSavedQueryStr() {
    chrome.storage.local.get(['queryStr', 'lastSearchTime'], (items) => {
      // Only restore the saved query if the last search was within the last 5
      // minutes
      if ((Date.now() - items.lastSearchTime) <= this.constructor.queryMaxAge) {
        this.search(items.queryStr);
        chrome.storage.local.set({lastSearchTime: Date.now()});
      }
    });
  }

  saveQueryStr() {
    chrome.storage.local.set({
      queryStr: this.queryStr,
      lastSearchTime: Date.now()
    });
  }

  // Perform a full search using the given query string
  search(queryStr) {

    this.queryStr = queryStr;
    this.saveQueryStr();
    let normalizedQueryStr = Core.normalizeQueryStr(queryStr);

    this.results.length = 0;
    // Always select the first result when the search query changes
    this.selectedResultIndex = 0;

    if (normalizedQueryStr === '') {
      this.loadingResults = false;
      this.onUpdateSearchStatus();
      return;
    }

    return this.searchByRef(normalizedQueryStr);

  }

  // Perform a search by reference using the given query string
  searchByRef(queryStr) {

    return this.refSearcher.search(queryStr)
      .then((results) => {
        if (results.length > 0) {
          this.results.push(...results);
          this.loadingResults = false;
          this.onUpdateSearchStatus();
          return results;
        } else {
          // If the ref search turns up no results, perform a content search
          this.loadingResults = true;
          this.onUpdateSearchStatus();
          return this.searchByContent(queryStr);
        }
      })
      .catch((error) => {
        this.error = error;
        this.onUpdateSearchStatus();
      });

  }

  // Perform a search by content using the given query string
  searchByContent(queryStr) {

    // Perform content search if no reference results turned up
    return this.contentSearcher.search(queryStr)
      .then((results) => {
        // The user may type faster than page fetches can finish, so ensure that
        // only the results from the last fetch (i.e. for the latest query
        // string) are displayed
        if (queryStr === this.queryStr) {
          this.results.push(...results);
          this.loadingResults = false;
          this.onUpdateSearchStatus();
          return results;
        }
      })
      .catch((error) => {
        this.error = error;
        this.onUpdateSearchStatus();
      });

  }

  // Methods related to the selected search result

  isSelectedResult(resultIndex) {
    return (resultIndex === this.selectedResultIndex);
  }

  selectResult(resultIndex) {
    this.selectedResultIndex = resultIndex;
  }

  getSelectedResult() {
    return this.results[this.selectedResultIndex];
  }

  // Select the next result in the results list
  selectNextResult() {
    this.selectedResultIndex += 1;
    // Wrap around as needed
    if (this.selectedResultIndex === this.results.length) {
      this.selectedResultIndex = 0;
    }
  }

  // Select the previous result in the results list
  selectPrevResult() {
    this.selectedResultIndex -= 1;
    if (this.selectedResultIndex < 0) {
      this.selectedResultIndex = this.results.length - 1;
    }
  }

}

// The number of milliseconds to wait (since the last search) before clearing
// the query
Searcher.queryMaxAge = 300e3;
// The time in milliseconds to wait (after the user has stopped typing) before
// performing the search
Searcher.searchDelay = 300;

export default Searcher;
