import cheerio from 'cheerio';
import Core from './core';
import Reference from './reference.js';

class ContentSearcher {

  search(queryStr) {

    let searchURL = `${this.constructor.baseSearchURL}`;
    return Core.getHTML(searchURL, {q: queryStr, version_id: 111}).then((html) => {
      return this.parseResults(html);
    });

  }

  // Parse the content search results from the given HTML string
  parseResults(html) {

    let $ = cheerio.load(html);
    let $references = $('li.reference');

    let results = [];
    $references.each((r, reference) => {
      let $reference = $(reference);
      results.push(new Reference({
        uid: Core.getUIDFromURL($reference.find('a').prop('href')),
        name: $reference.find('h3').text().trim(),
        content: $reference.find('p').text().trim(),
      }));
    });
    return results;

  }

}

ContentSearcher.baseSearchURL = 'https://www.bible.com/search/bible';

export default ContentSearcher;
