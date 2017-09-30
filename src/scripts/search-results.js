import autoBind from 'auto-bind';
import m from 'mithril';
import classNames from 'classnames';

// The search results list for a SearchFieldComponent
class SearchResultsComponent {

  constructor({attrs}) {
    Object.assign(this, attrs);
    autoBind(this);
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

  view() {

    return m('ol.search-results-list', {
      // Use event delegation to listen for mouse events on any of the
      // result list items
      onmouseover: this.selectByMouse,
      onclick: this.runDefaultResultActionByMouse
    }, this.searcher.results.map((result, r) => {

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

        m('div.search-result-title', result[this.titleKey]),
        this.subtitleKey ?
        m('div.search-result-subtitle', result[this.subtitleKey]) : null,

        // Available actions for the selected result
        this.actions && this.searcher.isSelectedResult(r) ?
        m('div.search-result-actions', this.actions.map((action) => {
          return m('a[href=#].search-result-action', {
            onclick: action.onclick
          }, action.linkText(result));
        })) : null

      ]);

    }));
  }

}

export default SearchResultsComponent;
