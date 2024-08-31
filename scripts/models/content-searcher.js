import debounce from 'debounce-promise';
import { getReferencesMatchingPhrase } from 'youversion-suggest';
import { getPreferences } from './preferences.js';

class ContentSearcher {
  // Search for Bible content matching the given query string, returning cached
  // results if possible
  async search(queryStr) {
    try {
      const items = await chrome.storage.local.get([
        'contentSearchResults',
        'contentSearchQueryStr'
      ]);
      if (items.contentSearchResults && queryStr === items.contentSearchQueryStr) {
        return items.contentSearchResults;
      } else {
        chrome.storage.local.set({ contentSearchQueryStr: queryStr });
        return this.fetchLatestResults(queryStr);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Fetch the latest results list from the YouVersion website
  async fetchLatestResults(queryStr) {
    try {
      const preferences = await getPreferences();
      const results = await getReferencesMatchingPhrase(queryStr, {
        language: preferences.language,
        version: preferences.version
      });
      chrome.storage.local.set({ contentSearchResults: results });
      return results;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Only run a content search if the last content search was at least some
  // amount of time ago (specified by searchDelay)
  static debounceContentSearch() {
    this.prototype.fetchLatestResults = debounce(
      this.prototype.fetchLatestResults,
      this.searchDelay
    );
  }
}

ContentSearcher.baseSearchURL = 'https://www.bible.com/search/bible';
// The time in milliseconds to wait (after the user has stopped typing) before
// performing the search
ContentSearcher.searchDelay = 300;
ContentSearcher.debounceContentSearch();

export default ContentSearcher;
