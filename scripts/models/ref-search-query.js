// A parsed search query for a Bible reference search
class RefSearchQuery {

  constructor(queryStr) {

    this.queryStr = queryStr;
    this.parseQueryStr();

  }

  // The regex for parsing a Bible reference is long and complicated, so split
  // them up into several regexes and combine them
  static initSearchPattern() {
    let book = /(\d?(?:[^\W\d_]|\s)+|\d)\s?/.source;
    let chapter = /(\d+)\s?/.source;
    let verse = /(\d+)\s?/.source;
    let endVerse = /(\d+)?\s?/.source;
    let version = /([^\W\d_](?:[^\W\d_]\d*|\s)*)?.*?/.source;
    let pattern = `^${book}(?:${chapter}(?:${verse}${endVerse})?${version})?$`;
    this.refPattern = new RegExp(pattern);
  }

  // Change the query string (or anything compared against the query string) to
  // be in a consistent format
  static normalizeQueryStr(queryStr) {
    queryStr = queryStr.toLowerCase();
    // Remove all non-alphanumeric characters
    queryStr = queryStr.replace(/[\W_]/gi, ' ', queryStr);
    // Remove extra whitespace
    queryStr = queryStr.trim();
    queryStr = queryStr.replace(/\s+/g, ' ', queryStr);
    // Parse shorthand reference notation
    queryStr = queryStr.replace(/(\d)(?=[a-z])/, '$1 ', queryStr);
    return queryStr;
  }

  // Parse the query string into its individual parts
  parseQueryStr() {
    let queryMatches = this.queryStr.match(this.constructor.refPattern);
    if (!queryMatches) {
      return;
    }
    this.parseBook(queryMatches);
    this.parseChapter(queryMatches);
    this.parseVerses(queryMatches);
    this.parseVersion(queryMatches);
  }

  // Individual functions for parsing each part of the query string reference

  parseBook(queryMatches) {
    let bookMatch = queryMatches[1];
    this.book = bookMatch.trimRight();
  }

  parseChapter(queryMatches) {
    let chapterMatch = queryMatches[2];
    this.chapter = Math.max(Number(chapterMatch), 1);
    if (!this.chapter) {
      this.chapter = 1;
    }
  }

  parseVerses(queryMatches) {
    let verseMatch = queryMatches[3];
    if (verseMatch) {
      this.verse = Math.max(Number(verseMatch), 1);
      this.parseEndVerse(queryMatches);
    }
  }

  parseEndVerse(queryMatches) {
    let endVerseMatch = queryMatches[4];
    if (endVerseMatch) {
      this.endVerse = Number(endVerseMatch);
    }
  }

  parseVersion(queryMatches) {
    let versionMatch = queryMatches[5];
    if (versionMatch) {
      this.version = versionMatch;
    }
  }

  // Check if already normalized-query is empty
  isEmpty() {
    return (this.queryStr === '');
  }

}

RefSearchQuery.initSearchPattern();

export default RefSearchQuery;
