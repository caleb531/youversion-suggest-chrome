import clsx from 'clsx';

// The search results list for a SearchFieldComponent
class SearchResultsComponent {
  oninit({ attrs }) {
    this.searcher = attrs.searcher;
  }

  // Get the index of a search result DOM element via its data-index attribute
  getResultElemIndex(resultElem) {
    return Number(resultElem.getAttribute('data-index'));
  }

  // Scroll the search result into view when the search result is outside the
  // visible area (such as when scrolling)
  scrollSelectedResultIntoView({ attrs, dom }) {
    let resultIndex = this.getResultElemIndex(dom);
    if (this.searcher.isSelectedResult(resultIndex)) {
      // Under some circumstances, the UI should not scroll the selected result
      // into view (i.e. if the user moused over the selected result); this
      // ensures that the results list does not unintentionally scroll while the
      // user is moving the cursor
      if (this.isScrollIntoViewEnabled) {
        dom.scrollIntoView({ block: 'nearest' });
      } else {
        // Reset flag to ensure that the above scrollIntoView logic can still
        // run (e.g. if triggered via keyboard navigation)
        this.isScrollIntoViewEnabled = true;
      }
    }
  }

  // Select whichever result the user is currently mousing over
  selectByMouse(mouseoverEvent) {
    let resultElem = mouseoverEvent.target.closest('.search-result');
    let newSelectedIndex = this.getResultElemIndex(resultElem);
    if (!this.searcher.isSelectedResult(newSelectedIndex)) {
      // Do not scroll the selected result into view when mousing over; expect
      // that the user will manually scroll it into view
      this.isScrollIntoViewEnabled = false;
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
      this.searcher.runDefaultAction(this.searcher.getSelectedResult());
      clickEvent.redraw = false;
    }
  }

  view({ attrs }) {
    return (
      <ol
        className="search-results-list"
        onmouseover={(event) => attrs.selectByMouse(event)}
        onclick={(event) => attrs.runDefaultResultActionByMouse(event)}
      >
        {this.searcher.results.map((result, r) => {
          return (
            <li
              data-index={r}
              className={clsx('search-result', {
                selected: this.searcher.isSelectedResult(r)
              })}
              onupdate={(vnode) => attrs.scrollSelectedResultIntoView(vnode)}
            >
              <div className="search-result-title">{result[attrs.titleKey]}</div>
              {attrs.subtitleKey ? (
                <div className="search-result-subtitle">{result[attrs.subtitleKey]}</div>
              ) : null}

              {/* Available actions for the selected result */}
              {attrs.actions && this.searcher.isSelectedResult(r) ? (
                <div className="search-result-actions">
                  {attrs.actions.map((action) => {
                    return (
                      <a href="#" className="search-result-action" onclick={action.onclick}>
                        {action.linkText(result)}
                      </a>
                    );
                  })}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    );
  }
}

export default SearchResultsComponent;
