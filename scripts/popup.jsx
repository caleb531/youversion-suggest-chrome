import m from 'mithril';
import LoadingIconComponent from './loading-icon.jsx';
import { getPreferences } from './models/preferences.js';
import Searcher from './models/searcher.js';
import OptionsIconComponent from './options-icon.jsx';
import SearchFieldComponent from './search-field.jsx';
import SearchResultsComponent from './search-results.jsx';

// The extension popup UI
class PopupComponent {
  oninit() {
    // Initialize a new Searcher object, making sure to redraw whenever results
    // are updated
    this.searcher = new Searcher({ onUpdateSearchStatus: () => m.redraw() });
    this.loadPreferences();
  }

  async loadPreferences() {
    this.preferences = await getPreferences();
  }

  // Handle keyboard shortcuts for navigating results
  handleKeydown(keydownEvent) {
    const { key, metaKey, ctrlKey, altKey } = keydownEvent;
    // Do not proceed if no results are selected
    if (this.searcher.results.length === 0) {
      // Prevent Mithril from redrawing for irrelevant keydown events
      keydownEvent.redraw = false;
      return;
    }
    if (metaKey) {
      this.searcher.isPrimaryActionDefault = true;
    }
    const associatedHandler = this.keyboardShortcuts.find((entry) => {
      return (
        entry.key === key &&
        (!entry.metaKey || (metaKey && entry.metaKey) || (ctrlKey && entry.metaKey)) &&
        (!entry.altKey || (altKey && entry.altKey))
      );
    });
    if (associatedHandler) {
      keydownEvent.preventDefault();
      associatedHandler.callback.call(this, keydownEvent);
    }
  }

  handleKeyup(keyupEvent) {
    const { key, metaKey, ctrlKey, altKey } = keyupEvent;
    if (!metaKey) {
      this.searcher.isPrimaryActionDefault = false;
    }
  }

  // View the selected result on YouVersion
  async viewSelectedResult(clickEvent) {
    clickEvent.preventDefault();
    clickEvent.stopPropagation();
    const selectedResult = this.searcher.getSelectedResult();
    this.searcher.viewResult(selectedResult);
  }

  // Copy the content of the selected reference via its action link
  async copySelectedResultContent(clickEvent) {
    clickEvent.preventDefault();
    clickEvent.stopPropagation();
    const selectedResult = this.searcher.getSelectedResult();
    // Do not request the reference content again until the current fetch has
    // finished (e.g. if the user clicks the Copy link multiple times)
    if (this.searcher.isCopyingContent) {
      return;
    }
    await this.searcher.copyResultContent(selectedResult);
    m.redraw();
  }

  view() {
    return (
      <div
        className="popup"
        tabindex={1}
        onkeydown={(event) => this.handleKeydown(event)}
        onkeyup={(event) => this.handleKeyup(event)}
      >
        <header className="popup-header">
          <a href="options.html" target="yvs_options" title="Settings">
            <OptionsIconComponent />
          </a>
          <h1 className="popup-title">YouVersion Bible Suggest</h1>
          <SearchFieldComponent
            searcher={this.searcher}
            autofocus={true}
            placeholder="Type a book, chapter, verse, or phrase"
          />
        </header>

        <div className="popup-content">
          {this.searcher.isLoadingResults ? (
            <div className="search-loading-icon-container">
              <LoadingIconComponent />
            </div>
          ) : this.searcher.queryStr === '' ? (
            <div className="popup-watermark" />
          ) : this.searcher.results.length === 0 ? (
            <div className="popup-status-message">No Results</div>
          ) : null}

          <SearchResultsComponent
            // Required
            searcher={this.searcher}
            actions={[
              // The preferences must be loaded asynchronously and therefore may
              // not exist by the initial render
              ...((this.searcher.isPrimaryActionDefault || this.preferences?.copybydefault) &&
              (!this.searcher.isPrimaryActionDefault || !this.preferences?.copybydefault)
                ? [
                    {
                      linkText: (ref) => (this.searcher.isCopyingContent ? 'Copying...' : 'Copy'),
                      onclick: (event) =>
                        this.copySelectedResultContent(event, {
                          onupdate: () => m.redraw()
                        })
                    },
                    {
                      linkText: (ref) => 'View',
                      onclick: (event) => this.viewSelectedResult(event)
                    }
                  ]
                : [
                    {
                      linkText: (ref) => 'View',
                      onclick: (event) => this.viewSelectedResult(event)
                    },
                    {
                      linkText: (ref) => (this.searcher.isCopyingContent ? 'Copying...' : 'Copy'),
                      onclick: (event) => this.copySelectedResultContent(event)
                    }
                  ])
            ]}
          />
        </div>
      </div>
    );
  }
}
// All keyboard shortcuts supported by the
PopupComponent.prototype.keyboardShortcuts = [
  {
    id: 'action-result:primary-action',
    key: 'Enter',
    callback: function () {
      // On enter key, action selected result (by default, view the reference)
      this.searcher.runDefaultAction(this.searcher.getSelectedResult(), {
        onupdate: () => m.redraw()
      });
    }
  },
  {
    id: 'select-next-result',
    key: 'ArrowDown',
    callback: function () {
      // On down arrow, select next result
      this.searcher.selectNextResult();
    }
  },
  {
    id: 'select-previous-result',
    key: 'ArrowUp',
    callback: function () {
      // On up arrow, select previous result
      this.searcher.selectPrevResult();
    }
  }
];

m.mount(document.querySelector('main'), PopupComponent);
