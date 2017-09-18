import m from 'mithril';
import classNames from 'classnames';
import Searcher from '../models/searcher';
import SearchIconComponent from './search-icon';
import LoadingIconComponent from './loading-icon';

// The front-end application UI
class AppComponent {

  constructor() {
    // Initialize a new Searcher object, making sure to redraw whenever results
    // are updated
    this.searcher = new Searcher({onUpdateSearchStatus: () => m.redraw()});
    this.bindAllMethods();
  }

  // Ensure that `this` is always bound to the class instance for all class
  // methods, no matter how they're called
  bindAllMethods() {
    Object.getOwnPropertyNames(this.constructor.prototype).forEach((methodName) => {
      if (methodName !== 'constructor') {
        this.constructor.prototype[methodName] = this.constructor.prototype[methodName].bind(this);
      }
    });
  }

  // Handle keyboard shortcuts for navigating results
  handleKeyboardNav(keydownEvent) {

    let keyCode = keydownEvent.keyCode;
    // Do not proceed if no results are selected
    if (this.searcher.results.length === 0) {
      // Prevent Mithril from redrawing for irrelevant keydown events
      keydownEvent.redraw = false;
      return;
    }

    if (keyCode === 13) {
      // On enter key, action selected result (by default, view the reference)
      this.searcher.actionSelectedResult();
      keydownEvent.preventDefault();
    } else if (keyCode === 40) {
      // On down arrow, select next result
      this.searcher.selectNextResult();
      keydownEvent.preventDefault();
    } else if (keyCode === 38) {
      // On up arrow, select previous result
      this.searcher.selectPrevResult();
      keydownEvent.preventDefault();
    } else {
      keydownEvent.redraw = false;
    }

  }

  // Get the index of a search result DOM element via its data-index attribute
  getResultElemIndex(resultElem) {
    return Number(resultElem.getAttribute('data-index'));
  }

  // Scroll the search result into view when the search result is outside the
  // visible area (such as when scrolling)
  scrollSelectedResultIntoView(vnode) {
    let resultIndex = this.getResultElemIndex(vnode.dom);
    if (this.searcher.isSelectedResult(resultIndex)) {
      vnode.dom.scrollIntoView({block: 'nearest'});
    }
  }

  // Select whichever result the user is currently mousing over
  selectByMouse(mouseoverEvent) {
    let resultElem = mouseoverEvent.target.closest('.search-result');
    let newSelectedIndex = this.getResultElemIndex(resultElem);
    if (!this.searcher.isSelectedResult(newSelectedIndex)) {
      this.searcher.selectResult(newSelectedIndex);
    } else {
      // Prevent Mithril from redrawing if the selected result hasn't changed
      // when hovering
      mouseoverEvent.redraw = false;
    }
  }

  // Action whichever result the user has clicked
  actionByMouse(clickEvent) {
    let resultElem = clickEvent.target.closest('.search-result');
    let resultIndex = this.getResultElemIndex(resultElem);
    if (this.searcher.isSelectedResult(resultIndex)) {
      this.searcher.actionSelectedResult();
    }
  }

  view() {
    return m('div.app', [
      m('header.app-header', [
        m('h1.app-title', 'YouVersion Suggest'),
        m('div.search-field-container', [
          m('input[type=text][autofocus].search-field', {
            placeholder: 'Type a book, chapter, verse, or keyword',
            value: this.searcher.queryStr,
            onkeydown: this.handleKeyboardNav,
            oninput: (inputEvent) => this.searcher.search(inputEvent.target.value)
          }),
          m(SearchIconComponent)
        ])
      ]),
      m('div.search-results-container', [
        this.searcher.queryStr === '' ?
        m('div.search-results-watermark') : null,
        this.searcher.loadingResults ?
        m('div.search-loading-icon-container', m(LoadingIconComponent)) :
        this.searcher.queryStr !== '' && this.searcher.results.length === 0 ?
        m('div.no-search-results-message', 'No Results') : null,
        m('ol.search-results-list', {
          // Use event delegation to listen for mouse events on any of the
          // result list items
          onmouseover: this.selectByMouse,
          onclick: this.actionByMouse
        }, [
          // Search results from the reference filter (e.g. 1co13.3-7)
          this.searcher.results.length > 0 ? [
            this.searcher.results.map((result, r) => {
              return m('li.search-result', {
                // Store the index on each result element for easy referencing
                // within event callbacks later
                'data-index': r,
                class: classNames({
                  'selected': this.searcher.isSelectedResult(r)
                }),
                // Scroll selected result into view as needed
                onupdate: this.scrollSelectedResultIntoView
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

export default AppComponent;
