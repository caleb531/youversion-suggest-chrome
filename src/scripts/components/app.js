import m from 'mithril';
import classNames from 'classnames';
import RefSearch from '../models/ref-search';
import SearchIconComponent from './search-icon';

// The front-end application UI
class AppComponent {

  constructor() {
    // Results for a "Filter by Reference" search
    this.searchResults = [];
    this.selectedResultIndex = 0;
    this.refSearch = new RefSearch();
    this.queryStr = '';
    chrome.storage.local.get(['queryStr', 'lastSearchTime'], (items) => {
      // Clear the query if it's been more than 5 minutes since last search
      if ((Date.now() - items.lastSearchTime) <= this.constructor.queryMaxAge) {
        this.triggerSearch(items.queryStr);
        chrome.storage.local.set({lastSearchTime: Date.now()});
      }
      m.redraw();
    });
  }

  triggerSearch(queryStr) {
    this.queryStr = queryStr;
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
      this.searchResults[this.selectedResultIndex].view();
      keydownEvent.preventDefault();
    } else if (keyCode === 40) {
      // On down arrow, select next result
      this.selectedResultIndex += 1;
      // Wrap around as needed
      if (this.selectedResultIndex === this.searchResults.length) {
        this.selectedResultIndex = 0;
      }
      keydownEvent.preventDefault();
    } else if (keyCode === 38) {
      // On up arrow, select previous result
      this.selectedResultIndex -= 1;
      // Wrap around
      if (this.selectedResultIndex < 0) {
        this.selectedResultIndex = this.searchResults.length - 1;
      }
      keydownEvent.preventDefault();
    } else {
      keydownEvent.redraw = false;
    }
  }

  // Scroll the search result into view when the search result is outside the
  // visible area (such as when scrolling)
  scrollSelectedResultIntoView(vnode, resultIndex) {
    if (resultIndex === this.selectedResultIndex) {
      vnode.dom.scrollIntoView({block: 'nearest'});
    }
  }

  view() {
    return m('div.app', [
      m('header.app-header', [
        m('h1.app-title', 'YouVersion Suggest'),
        m('div.search-field-container', [
          m('input[type=text][autofocus].search-field', {
            placeholder: 'Type a book, chapter, verse, or keyword',
            value: this.queryStr,
            onkeydown: this.handleKeyboardNav.bind(this),
            oninput: (inputEvent) => this.triggerSearch(inputEvent.target.value)
          }),
          m(SearchIconComponent)
        ])
      ]),
      m('div.search-results-container', {
        class: classNames({
          'no-search-results': (this.searchResults.length === 0)
        })
      }, [
        this.queryStr === '' ?
        m('div.search-results-watermark') : null,
        this.queryStr !== '' && this.searchResults.length === 0 ?
        m('div.no-search-results-message', 'No Results') : null,
        m('ol.search-results-list', [
          // Search results from the reference filter (e.g. 1co13.3-7)
          this.searchResults.length > 0 ? [
            this.searchResults.map((result, r) => {
              return m('li.search-result', {
                class: classNames({
                  'selected': r === this.selectedResultIndex
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
