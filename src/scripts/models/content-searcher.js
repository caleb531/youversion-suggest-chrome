import debounce from 'debounce-promise';
import cheerio from 'cheerio';
import {getHTML} from './fetch.js';
import {getPreferences} from './preferences.js';
import Reference from './reference.js';

class ContentSearcher {

  // Search for Bible content matching the given query string, returning cached
  // results if possible
  search(queryStr) {
    return new Promise((resolve) => {
      chrome.storage.local.get(['contentSearchResults', 'contentSearchQueryStr'], (items) => {
        if (items.contentSearchResults && queryStr === items.contentSearchQueryStr) {
          resolve(items.contentSearchResults.map((reference) => {
            return new Reference(reference);
          }));
        } else {
          chrome.storage.local.set({contentSearchQueryStr: queryStr});
          resolve(this.fetchLatestResults(queryStr));
        }
      });
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
  }

  // Fetch the latest results list from the YouVersion website
  fetchLatestResults(queryStr) {
    let searchURL = `${this.constructor.baseSearchURL}`;
    return getPreferences()
      .then((preferences) => preferences.version)
      .then((preferredVersion) => {
        return getHTML(searchURL, {q: queryStr, version_id: preferredVersion});
      })
      .then((html) => {
        let results = this.parseResults(html);
        chrome.storage.local.set({contentSearchResults: results});
        return results;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }

  // Only run a content search if the last content search was at least some
  // amount of time ago (specified by searchDelay)
  static debounceContentSearch() {
    this.prototype.fetchLatestResults = debounce(this.prototype.fetchLatestResults, this.searchDelay);
  }


  // Parse the content search results from the given HTML string
  parseResults(html) {

    let $ = cheerio.load(html);
    let $references = $('li.reference');

    let results = [];
    $references.each((r, reference) => {
      let $reference = $(reference);
      results.push(new Reference({
        id: Reference.getIDFromURL($reference.find('a').prop('href')),
        name: $reference.find('h3').text().trim(),
        content: $reference.find('p').text().trim(),
      }));
    });
    return results;

  }

}

ContentSearcher.baseSearchURL = 'https://www.bible.com/search/bible';
// The time in milliseconds to wait (after the user has stopped typing) before
// performing the search
ContentSearcher.searchDelay = 300;
ContentSearcher.debounceContentSearch();

export default ContentSearcher;
