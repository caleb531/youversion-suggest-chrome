import m from 'mithril';
import ReferenceSearch from '../models/reference-search';

// The front-end application UI
class AppComponent {

  constructor() {
    // Results for a "Filter by Reference" search
    this.referenceSearchResults = [];
    this.referenceSearch = new ReferenceSearch();
    this.queryStr = '';
  }

  triggerSearch(inputEvent) {
    this.queryStr = inputEvent.target.value;
    this.referenceSearch.search(this.queryStr).then((results) => {
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
      m('ol.search-results', [
        this.queryStr !== '' && this.referenceSearchResults.length === 0 ?
        m('li.search-result.null-result', [
            m('div.search-result-title', 'No Results'),
            m('div.search-result-subtitle', `No references matching \'${this.queryStr}\'`)
        ]) : null,
        // Search results from the reference filter (e.g. 1co13.3-7)
        this.referenceSearchResults.length > 0 ? [
          this.referenceSearchResults.map((result) => {
            return m('li.search-result.reference-search-result', [
              m('div.search-result-title', result.title),
              m('div.search-result-subtitle', result.subtitle)
            ]);
          })
        ] : null
      ])
    ]);
  }

}

export default AppComponent;
