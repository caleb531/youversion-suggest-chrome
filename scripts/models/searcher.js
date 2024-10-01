import { fetchReferenceContent, getReferencesMatchingName } from 'youversion-suggest';
import ContentSearcher from './content-searcher.js';
import { getPreferences } from './preferences.js';

// A generic class for performing several kinds of Bible searches via
// YouVersion; every Searcher instance can perform more than one search in its
// lifetime
class Searcher {
  // Initialize the Searcher with a callback to run whenever the internal search
  // results are updated
  constructor({ onUpdateSearchStatus }) {
    this.queryStr = '';
    this.restoreSavedQueryStr();

    this.contentSearcher = new ContentSearcher();

    // The last-returned list search results
    this.results = [];
    this.selectedResultIndex = 0;
    this.isLoadingResults = false;
    this.onUpdateSearchStatus = onUpdateSearchStatus;
  }

  // Retrieve the last-searched query from the extension's local data store
  async restoreSavedQueryStr() {
    const items = await chrome.storage.local.get(['queryStr', 'lastSearchTime']);
    // Only restore the saved query if the last search was within the last 5
    // minutes
    if (Date.now() - items.lastSearchTime <= this.constructor.queryMaxAge) {
      this.search(items.queryStr);
      chrome.storage.local.set({ lastSearchTime: Date.now() });
    }
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

    // Always select the first result when the search query changes
    this.selectedResultIndex = 0;

    if (queryStr.trim() === '') {
      this.isLoadingResults = false;
      this.onUpdateSearchStatus();
      return;
    }

    return this.searchByRef(queryStr);
  }

  // Perform a search by reference using the given query string
  async searchByRef(queryStr) {
    try {
      const preferences = await getPreferences();
      const results = await getReferencesMatchingName(queryStr, {
        language: preferences.language,
        fallbackVersion: preferences.version
      });
      this.results.length = 0;
      if (results.length > 0) {
        this.results.push(...results);
        this.isLoadingResults = false;
        this.onUpdateSearchStatus();
        return results;
      } else {
        // If the ref search turns up no results, perform a content search
        this.isLoadingResults = true;
        this.onUpdateSearchStatus();
        return this.searchByContent(queryStr);
      }
    } catch (error) {
      this.error = error;
      this.isLoadingResults = false;
      this.onUpdateSearchStatus();
    }
  }

  // Perform a search by content using the given query string
  async searchByContent(queryStr) {
    try {
      // Perform content search if no reference results turned up
      const results = await this.contentSearcher.search(queryStr);
      // The user may type faster than page fetches can finish, so ensure that
      // only the results from the last fetch (i.e. for the latest query
      // string) are displayed
      if (queryStr === this.queryStr) {
        this.results.push(...results);
        this.isLoadingResults = false;
        this.onUpdateSearchStatus();
        return results;
      }
    } catch (error) {
      this.error = error;
      this.onUpdateSearchStatus();
    }
  }

  // View this reference result on the YouVersion website
  viewResult(result) {
    window.open(result.url);
  }

  // Copy the full contents of this reference to the clipboard
  async copyResultContent(reference, options) {
    options?.onupdate?.();
    this.isCopyingContent = true;
    try {
      const preferences = await getPreferences();
      const referenceWithContent = await fetchReferenceContent(reference.id, {
        language: preferences.language,
        version: preferences.version,
        includeLineBreaks: preferences.linebreaks,
        includeVerseNumbers: preferences.versenumbers
      });
      this.isCopyingContent = false;
      options?.onupdate?.();
      navigator.clipboard.writeText(
        `${referenceWithContent.name} (${referenceWithContent.version.name})\n\n${referenceWithContent.content}`
      );
      this.postNotification({
        title: 'Copied!',
        message: `${reference.name} copied to the clipboard`
      });
    } catch (error) {
      this.isCopyingContent = false;
      options?.onupdate?.();
      this.postNotification({
        title: 'Error',
        message: `Could not copy ${reference.name} (${reference.version.name}) to the clipboard`
      });
      return Promise.reject(error);
    }
  }

  // Spawn a browser notification with the given parameters
  postNotification(params) {
    chrome.notifications.create(
      Object.assign(
        {
          type: 'basic',
          iconUrl: 'icons/icon-square.png'
        },
        params
      )
    );
  }

  setDefaultAction(actionType) {
    const isPrimary = actionType === 'primary';
  }

  // Define the default action for any reference result
  async runDefaultAction(result, options = {}) {
    const preferences = await getPreferences();
    // The correct default action to run can be represented by
    // isPrimaryActionDefault XOR copyByDefault
    if (
      (this.isPrimaryActionDefault || preferences.copybydefault) &&
      (!this.isPrimaryActionDefault || !preferences.copybydefault)
    ) {
      this.copyResultContent(result, options);
    } else {
      this.viewResult(result);
    }
  }

  // Methods related to the selected search result

  isSelectedResult(resultIndex) {
    return resultIndex === this.selectedResultIndex;
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

  clearSearch() {
    this.queryStr = '';
    this.results.length = 0;
    this.selectedResultIndex = 0;
    this.isLoadingResults = false;
    this.saveQueryStr();
  }
}

// The number of milliseconds to wait (since the last search) before clearing
// the query
Searcher.queryMaxAge = 300e3;

export default Searcher;
