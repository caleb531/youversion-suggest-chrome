import Core from './core';

class RefSearchQuery {

  constructor(queryStr) {

    this.queryStr = Core.normalizeQueryStr(queryStr);
    this.parseQueryStr();

  }

  // The regex for parsing a Bible reference is long and complicated, so split
  // them up into several regexes and combine them
  static initSearchPattern() {
    let book = /(\d?(?:[^\W\d_]|\s)+|\d)\s?/.source;
    let chapter = /(\d+)\s?/.source;
    let verse = /(\d+)\s?/.source;
    let endverse = /(\d+)?\s?/.source;
    let version = /([^\W\d_](?:[^\W\d_]\d*|\s)*)?.*?/.source;
    let pattern = `^${book}(?:${chapter}(?:${verse}${endverse})?${version})?$`;
    this.refPattern = new RegExp(pattern);
  }

  // Parse the query string into its individual parts
  parseQueryStr() {

    let queryMatches = this.queryStr.match(this.constructor.refPattern);
    if (!queryMatches) {
      return;
    }

    let bookMatch = queryMatches[1];
    this.book = bookMatch.trimRight();

    let chapterMatch = queryMatches[2];
    if (chapterMatch) {

      this.chapter = Math.max(Number(chapterMatch), 1);

      let verseMatch = queryMatches[3];
      if (verseMatch) {
        this.verse = Math.max(Number(verseMatch), 1);
        let endVerseMatch = queryMatches[4];

        if (endVerseMatch) {
          this.endverse = Number(endVerseMatch);
        }

      }

      let versionMatch = queryMatches[5];
      if (versionMatch) {
        this.version = Core.normalizeQueryStr(versionMatch);
      }

    }

  }

}

RefSearchQuery.initSearchPattern();

export default RefSearchQuery;
