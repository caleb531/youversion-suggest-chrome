import cheerio from 'cheerio';
import Core from './core';
import RefResult from './ref-result.js';

class ContentSearch {

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
          title: $reference.find('h3').text(),
          subtitle: $reference.find('p').text()
        }));
      });

      return results;
    });

  }

}

ContentSearch.baseSearchURL = 'https://www.bible.com/search/bible';

export default ContentSearch;
