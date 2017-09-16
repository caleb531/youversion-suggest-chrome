import cheerio from 'cheerio';
import Core from './core';

class ContentSearch {

  search(queryStr) {

    queryStr = Core.normalizeQueryStr(queryStr);
    let searchURL = `${this.constructor.baseSearchURL}`;
    console.log(Core.getHTML(searchURL), {q: queryStr, version_id: 111});

  }

}

ContentSearch.baseSearchURL = 'https://www.bible.com/search/bible';

export default ContentSearch;
