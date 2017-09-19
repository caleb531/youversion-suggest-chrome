import debounce from 'debounce-promise';
import cheerio from 'cheerio';
import Core from './core';
import RefResult from './ref-result.js';

class ContentSearcher {

  constructor() {
    // Only run a content search if the last content search was at least some
    // amount of time ago (specified by searchDelay)
    this.constructor.prototype.search = debounce(this.constructor.prototype.search, this.constructor.searchDelay);
  }

  search(queryStr) {

    let results = [];
    queryStr = Core.normalizeQueryStr(queryStr);
    if (queryStr === '') {
      return Promise.reject();
    }

    let searchURL = `${this.constructor.baseSearchURL}`;
    return Core.getHTML(searchURL, {q: queryStr, version_id: 111}).then((html) => {

      let $ = cheerio.load(html);
      let $references = $('li.reference');

      $references.each((r, reference) => {
        let $reference = $(reference);
        results.push(new RefResult({
          title: $reference.find('h3').text().trim(),
          subtitle: $reference.find('p').text().trim(),
          uid: $reference.find('a').prop('href').match(Core.refUIDPattern)[0]
        }));
      });

      if (results.length > 0) {
        return Promise.resolve(results);
      } else {
        return Promise.reject();
      }
    });

  }

}

ContentSearcher.baseSearchURL = 'https://www.bible.com/search/bible';
// The time in milliseconds to wait (after the user has stopped typing) before
// performing the search
ContentSearcher.searchDelay = 300;

export default ContentSearcher;
