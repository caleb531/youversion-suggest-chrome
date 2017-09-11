import Core from './core';

class RefSearchQuery {

  constructor(queryStr) {

    this.queryStr = Core.normalizeQueryStr(queryStr);
    this.parseQueryStr();

  }

  // The regex for parsing a Bible reference is long and complicated, so split
  // them up into several regexes and combine them
  static initSearchPattern() {
    const book = /(\d?(?:[^\W\d_]|\s)+|\d)\s?/.source;
    const chapter = /(\d+)\s?/.source;
    const verse = /(\d+)\s?/.source;
    const endverse = /(\d+)?\s?/.source;
    const version = /([^\W\d_](?:[^\W\d_]\d*|\s)*)?.*?/.source;
    const pattern = `^${book}(?:${chapter}(?:${verse}${endverse})?${version})?$`;
    this.refPattern = new RegExp(pattern);
  }

  // Parse the query string into its individual parts
  parseQueryStr() {

    const queryMatches = this.queryStr.match(this.constructor.refPattern);
    if (!queryMatches) {
      return;
    }

    const bookMatch = queryMatches[1];
    this.book = bookMatch.trimRight();

    const chapterMatch = queryMatches[2];
    if (chapterMatch) {

      this.chapter = Math.max(Number(chapterMatch), 1);

      const verseMatch = queryMatches[3];
      if (verseMatch) {
        this.verse = Math.max(Number(verseMatch), 1);
        const endVerseMatch = queryMatches[4];

        if (endVerseMatch) {
          this.endverse = Number(endVerseMatch);
        }

      }

      const versionMatch = queryMatches[5];
      if (versionMatch) {
        this.version = Core.normalizeQueryStr(versionMatch);
      }

    }

  }

}

RefSearchQuery.initSearchPattern();

export default RefSearchQuery;
