import m from 'mithril';
import classNames from 'classnames';
import Searcher from './models/searcher';
import SearchIconComponent from './components/search-icon';
import LoadingIconComponent from './components/loading-icon';

// The extension popup UI
class PopupComponent {

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
      this.searcher.getSelectedResult().runDefaultAction();
      keydownEvent.preventDefault();
      keydownEvent.redraw = false;
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

  // Run the main search function as soon as the search field contents change
  triggerSearch(inputEvent) {
    this.searcher.search(inputEvent.target.value);
    inputEvent.redraw = false;
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

  // Run default action for whichever result the user has clicked
  runDefaultResultActionByMouse(clickEvent) {
    let resultElem = clickEvent.target.closest('.search-result');
    let resultIndex = this.getResultElemIndex(resultElem);
    if (this.searcher.isSelectedResult(resultIndex)) {
      this.searcher.getSelectedResult().runDefaultAction();
      clickEvent.redraw = false;
    }
  }

  // Copy the content of the selected reference via its action link
  copyContentByLink(clickEvent) {
    let actionLinkElem = clickEvent.target;
    let resultElem = actionLinkElem
      .closest('.search-result');
    let resultIndex = this.getResultElemIndex(resultElem);
    if (this.searcher.isSelectedResult(resultIndex)) {
      let selectedRef = this.searcher.getSelectedResult();
      selectedRef.copy().then(() => {
        this.postNotification({
          title: selectedRef.name,
          message: `Contents copied to clipboard!`
        });
        m.redraw();
      });
    }
    clickEvent.preventDefault();
    clickEvent.stopPropagation();
  }

  // Spawn a browser notification with the given parameters
  postNotification(params) {
    chrome.notifications.create(Object.assign({
      type: 'basic',
      iconUrl: 'icons/icon-square.png'
    }, params));
  }

  view() {

    return m('div.popup', [
      m('header.popup-header', [
        m('h1.popup-title', 'YouVersion Suggest'),
        m('div.search-field-container', [
          m('input[type=text][autofocus].search-field', {
            placeholder: 'Type a book, chapter, verse, or keyword',
            value: this.searcher.queryStr,
            onkeydown: this.handleKeyboardNav,
            oninput: this.triggerSearch
          }),
          m(SearchIconComponent)
        ])
      ]),

      m('div.popup-content', [

        this.searcher.loadingResults ?
        m('div.search-loading-icon-container', m(LoadingIconComponent)) :

        this.searcher.queryStr === '' ?
        m('div.popup-watermark') :

        this.searcher.results.length === 0 ?
        m('div.popup-status-message', 'No Results') : null,

        m('ol.search-results-list', {
          // Use event delegation to listen for mouse events on any of the
          // result list items
          onmouseover: this.selectByMouse,
          onclick: this.runDefaultResultActionByMouse
        }, this.searcher.results.map((reference, r) => {
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

            m('div.search-result-title', reference.name),
            reference.content ?
            m('div.search-result-subtitle', reference.content) : null,

            this.searcher.isSelectedResult(r) ?
            m('div.search-result-actions', [
              m('a[href=#].search-result-action', {
                onclick: this.copyContentByLink
              }, reference.copyingContent ? 'Copying...' : 'Copy')
            ]) : null

          ]);
        }))
      ])
    ]);

  }

}

m.mount(document.querySelector('main'), PopupComponent);
