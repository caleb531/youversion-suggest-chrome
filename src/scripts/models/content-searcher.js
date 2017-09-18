import cheerio from 'cheerio';
import Core from './core';
import RefResult from './ref-result.js';

class ContentSearcher {

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

export default ContentSearcher;
