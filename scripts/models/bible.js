import {getJSON} from './fetch.js';

// Retrieve the Bible data for the given language
export function getBibleLanguageData(language) {
  return getJSON(`data/bible/language-${language}.json`);
}

// Retrieve an object of YouVersion book IDs mapped to the number of chapters
// in each
export function getBibleChapterData() {
  return getJSON('data/bible/chapters.json');
}

// Retrieve the full list of supported languages
export function getLanguages() {
  return getJSON('data/bible/languages.json');
}
