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
        m('div.search-field-container', [
          m('input[type=text][autofocus].search-field', {
            placeholder: 'Type a book, chapter, verse, or keyword',
            oninput: this.triggerSearch.bind(this)
          }),
          m('svg[viewBox="0 0 1792 1792"].search-field-icon', [
            m('path[d="M1216 832q0-185-131.5-316.5t-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5 316.5-131.5 131.5-316.5zm512 832q0 52-38 90t-90 38q-54 0-90-38l-343-342q-179 124-399 124-143 0-273.5-55.5t-225-150-150-225-55.5-273.5 55.5-273.5 150-225 225-150 273.5-55.5 273.5 55.5 225 150 150 225 55.5 273.5q0 220-124 399l343 343q37 37 37 90z"]')
          ])
        ])
      ]),
      m('div.search-results-container', [
        m('div.search-results-watermark', {
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
