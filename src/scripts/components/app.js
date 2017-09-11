import m from 'mithril';
import classNames from 'classnames';
import RefSearch from '../models/ref-search';

// The front-end application UI
class AppComponent {

  constructor() {
    // Results for a "Filter by Reference" search
    this.refSearchResults = [];
    this.refSearch = new RefSearch();
    this.queryStr = '';
  }

  triggerSearch(inputEvent) {
    this.queryStr = inputEvent.target.value;
    this.refSearch.search(this.queryStr).then((results) => {
      this.refSearchResults = results;
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
        m('div.search-results-background', {
          class: classNames({'visible': this.queryStr === ''})
        }),
        m('ol.search-results-list', [
          this.queryStr !== '' && this.refSearchResults.length === 0 ?
          m('li.search-result.null-result', [
              m('div.search-result-title', 'No Results'),
              m('div.search-result-subtitle', `No references matching \'${this.queryStr}\'`)
          ]) : null,
          // Search results from the reference filter (e.g. 1co13.3-7)
          this.refSearchResults.length > 0 ? [
            this.refSearchResults.map((result) => {
              return m('li.search-result.ref-search-result', [
                m('div.search-result-title', result.title),
                m('div.search-result-subtitle', result.subtitle)
              ]);
            })
          ] : null
        ])
      ])
    ]);
  }

}

export default AppComponent;
