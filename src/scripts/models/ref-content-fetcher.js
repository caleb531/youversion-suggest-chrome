import cheerio from 'cheerio';
import Core from './core';

class RefContentFetcher {

  constructor(reference) {
    this.ref = reference;
    this.parseRef();
  }

  parseRef() {
    // If a verse is given, start at that verse (at least)
    if (this.ref.verse) {
      this.startVerseNum = this.ref.verse;
      if (this.ref.endVerse) {
        this.endVerseNum = this.ref.endVerse;
      } else {
        // The end verse is inclusive, so if one isn't given, make the end verse
        // the start verse
        this.endVerseNum = this.ref.verse;
      }
    } else {
      // Otherwise, fetch all verses in the chapter
      this.startVerseNum = 1;
      this.endVerseNum = Infinity;
    }
  }

  // Fetch the textual content of the given Bible reference; returns a promise
  fetchContent() {

    let chapterURL = `${Core.baseRefURL}/${this.getChapterUID().toUpperCase()}`;
    return Core.getHTML(chapterURL).then((html) => {
      return this.parseContentFromHTML(html);
    });

  }

  // Build the language-agnostic unique identifier for this chapter
  getChapterUID() {
    // The chapter UID will always be contained within the reference ID, no
    // matter what type of reference it is
    return this.ref.uid.match(/^(\d+)\/([a-z0-9]{3})\.\d+/)[0];
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
  // add to the reference content
  getSectionSpacing($section) {
    let sectionType = $section.prop('class');
    if (this.constructor.blockElems.has(sectionType)) {
      return '\n\n';
    } else if (this.constructor.breakElems.has(sectionType)) {
      return '\n';
    }
  }

  // Retrieve all reference content within the given section
  getSectionContent($section) {
    let sectionContentParts = [this.getSectionSpacing($section)];
    let $verses = $section.children('.verse');
    $verses.each((v, verse) => {
      let $verse = this.$(verse);
      if (this.isVerseWithinRange($verse)) {
        sectionContentParts.push(...$verse.find('.content').text());
      }
    });
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
