import m from 'mithril';
import ReferenceSearch from '../models/reference-search';

// The front-end application UI
class AppComponent {

  constructor() {
    // Results for a "Filter by Reference" search
    this.referenceSearchResults = [];
    this.referenceSearch = new ReferenceSearch();
  }

  triggerSearch(inputEvent) {
    const queryStr = inputEvent.target.value;
    this.referenceSearch.search(queryStr).then((results) => {
      this.referenceSearchResults = results;
      m.redraw();
    });
  }

  view() {
    return m('div.app', [
      m('header.app-header', [
        m('h1.app-title', 'YouVersion Suggest'),
        m('input[type=text][autofocus].search-input', {
          placeholder: 'Type a book, chapter, verse, or keyword',
          oninput: this.triggerSearch.bind(this)
        })
      ]),
      m('div.search-results-container', [
        // Search results from the reference filter (e.g. 1co13.3-7)
        this.referenceSearchResults.length > 0 ?
        m('ol.reference-search-results', [
          this.referenceSearchResults.map((result) => {
            return m('li.search-result.reference-search-result', [
              m('div.search-result-title', result.title),
              m('div.search-result-subtitle', result.subtitle)
            ]);
          })
        ]) : null
      ])
    ]);
  }

}

export default AppComponent;
