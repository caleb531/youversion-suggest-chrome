import cheerio from 'cheerio';
import {getHTML} from './fetch';

class RefContentFetcher {

  constructor(reference) {
    this.ref = reference;
    this.setVerseRangeToFetch();
  }

  // Determine the range of verses to fetch based on the particular reference
  // passed to the fetcher
  setVerseRangeToFetch() {
    // If a verse is given, start at that verse (at least)
    if (this.ref.verse) {
      this.startVerseNum = this.ref.verse;
      if (this.ref.endVerse) {
        this.endVerseNum = this.ref.endVerse;
      } else {
        // If fetching a single verse, the start verse and end verse numbers
        // will be the same
        this.endVerseNum = this.ref.verse;
      }
    } else {
      // If reference is a full chapter, set verse range to all verses in the
      // chapter
      this.startVerseNum = 1;
      // The fetcher will stop if it reaches the last verse in the chapter; an
      // end verse number of Infinity only implies that the verse range has no
      // upper limit
      this.endVerseNum = Infinity;
    }
  }

  // Fetch the textual content of the given Bible reference; returns a promise
  fetchContent() {

    return getHTML(this.ref.getChapterURL())
      .then((html) => {
        let content = this.parseContentFromHTML(html);
        if (content !== '') {
          return content;
        } else {
          return Promise.reject(new Error('Fetched reference content is empty'));
        }
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });

  }

  // Parse the given YouVersion HTML and return a string a reference content
  parseContentFromHTML(html) {
    this.$ = cheerio.load(html);
    let $chapter = this.$('.chapter');
    let contentParts = [];

    // Loop over sections indicating paragraphs / breaks in the text
    $chapter.children().each((s, section) => {
      let $section = this.$(section);
      contentParts.push(...this.getSectionContent($section));
    });
    return this.normalizeRefContent(contentParts.join(''));
  }

  // Determine the appropriate amount of spacing (e.g. line/paragraph breaks) to
  // insert before the given section of content
  getSpacingBeforeSection($section) {
    let sectionType = $section.prop('class');
    if (this.constructor.blockElems.has(sectionType)) {
      return '\n\n';
    } else if (this.constructor.breakElems.has(sectionType)) {
      return '\n';
    }
  }

  // Determine the spacing to insert after the given section of content
  getSpacingAfterSection($section) {
    let sectionType = $section.prop('class');
    if (this.constructor.blockElems.has(sectionType)) {
      return '\n\n';
    }
  }

  // Retrieve all reference content within the given section
  getSectionContent($section) {
    let sectionContentParts = [this.getSpacingBeforeSection($section)];
    let $verses = $section.children('.verse');
    $verses.each((v, verse) => {
      let $verse = this.$(verse);
      if (this.isVerseWithinRange($verse)) {
        sectionContentParts.push(...$verse.find('.content').text());
      }
    });
    sectionContentParts.push(this.getSpacingAfterSection($section));
    return sectionContentParts;
  }

  // Return true if the given verse element is within the designated verse range
  isVerseWithinRange($verse) {
    let verseNum = this.getVerseNumberFromClass($verse);
    return (verseNum >= this.startVerseNum && verseNum <= this.endVerseNum);
  }

  // Parse the verse number from the given verse element's HTML class
  getVerseNumberFromClass($verse) {
    return $verse.prop('class').match(/v(\d+)/i)[1];
  }

  // Strip superfluous whitespace from throughout reference content
  normalizeRefContent(content) {
    // Strip leading/trailing whitespace for entire reference
    content = content.trim();
    // Collapse consecutive spaces into a single space
    content = content.replace(/ {2,}/gi, ' ');
    // Collapse sequences of three or more newlines into two
    content = content.replace(/\n{3,}/gi, '\n\n');
    // Strip leading/trailing whitespace for each paragraph
    content = content.replace(/ ?\n ?/gi, '\n');
    return content;
  }

}

// Elements that should be surrounded by blank lines
RefContentFetcher.blockElems = new Set(['b', 'p', 'm']);
// Elements that should trigger a single line break
RefContentFetcher.breakElems = new Set(['li1', 'q1', 'q2', 'qc']);

export default RefContentFetcher;
