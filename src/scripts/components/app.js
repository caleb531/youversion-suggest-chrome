import m from 'mithril';
import classNames from 'classnames';
import RefSearch from '../models/ref-search';

// The front-end application UI
class AppComponent {

  constructor() {
    // Results for a "Filter by Reference" search
    this.searchResults = [];
    this.currentResultIndex = 0;
    this.refSearch = new RefSearch();
    this.queryStr = '';
    chrome.storage.local.get(['queryStr', 'lastSearchTime'], (items) => {
      // Clear the query if it's been more than 5 minutes since last search
      if ((Date.now() - items.lastSearchTime) <= this.constructor.queryMaxAge) {
        this.queryStr = items.queryStr;
        chrome.storage.local.set({lastSearchTime: Date.now()});
      }
      m.redraw();
    });
  }

  triggerSearch(inputEvent) {
    this.queryStr = inputEvent.target.value;
    chrome.storage.local.set({
      queryStr: this.queryStr,
      lastSearchTime: Date.now()
    });
    this.searchResults.length = 0;
    this.refSearch.search(this.queryStr).then((results) => {
      this.searchResults.push.apply(this.searchResults, results);
      m.redraw();
    });
  }

  // Handle keyboard shortcuts for navigating results
  handleKeyboardNav(keydownEvent) {
    let keyCode = keydownEvent.keyCode;
    // Do not proceed if no results are selected
    if (this.searchResults.length === 0) {
      return;
    }
    if (keyCode === 13) {
      // On enter key, view reference
      this.searchResults[this.currentResultIndex].view();
      keydownEvent.preventDefault();
    } else if (keyCode === 40) {
      // On down arrow, select next result
      this.currentResultIndex += 1;
      // Wrap around as needed
      if (this.currentResultIndex === this.searchResults.length) {
        this.currentResultIndex = 0;
      }
      keydownEvent.preventDefault();
    } else if (keyCode === 38) {
      // On up arrow, select previous result
      this.currentResultIndex -= 1;
      // Wrap around
      if (this.currentResultIndex < 0) {
        this.currentResultIndex = this.searchResults.length - 1;
      }
    }
  }

  // Scroll the search result into view when the search result is outside the
  // visible area (such as when scrolling)
  scrollSelectedResultIntoView(vnode, resultIndex) {
    if (resultIndex === this.currentResultIndex) {
      vnode.dom.scrollIntoView({block: 'nearest'});
    }
  }

  view() {
    return m('div.app', [
      m('header.app-header', {
        class: classNames({
          'no-search-results': (this.searchResults.length === 0)
        })
      }, [
        m('h1.app-title', 'YouVersion Suggest'),
        m('div.search-field-container', [
          m('input[type=text][autofocus].search-field', {
            placeholder: 'Type a book, chapter, verse, or keyword',
            value: this.queryStr,
            onkeydown: this.handleKeyboardNav.bind(this),
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
        m('div.no-search-results-message', {
          class: classNames({
            visible: (this.queryStr !== '' && this.searchResults.length === 0)
          })
        }, 'No Results'),
        m('ol.search-results-list', [
          // Search results from the reference filter (e.g. 1co13.3-7)
          this.searchResults.length > 0 ? [
            this.searchResults.map((result, r) => {
              return m('li.search-result', {
                class: classNames({
                  'selected': r === this.currentResultIndex
                }),
                // Scroll selected result into view as needed
                onupdate: (vnode) => this.scrollSelectedResultIntoView(vnode, r)
              }, [
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

// The time since the last search (in milliseconds) to wait before clearing the
// query
AppComponent.queryMaxAge = 300e3;

export default AppComponent;
