import autoBind from 'auto-bind';
import m from 'mithril';
import LoadingIconComponent from './loading-icon.jsx';
import Searcher from './models/searcher.js';
import OptionsIconComponent from './options-icon.jsx';
import SearchFieldComponent from './search-field.jsx';
import SearchResultsComponent from './search-results.jsx';

// The extension popup UI
class PopupComponent {
  constructor() {
    // Initialize a new Searcher object, making sure to redraw whenever results
    // are updated
    this.searcher = new Searcher({ onUpdateSearchStatus: () => m.redraw() });
    autoBind(this);
  }

  // Copy the content of the selected reference via its action link
  async copyContentByLink(clickEvent) {
    clickEvent.preventDefault();
    clickEvent.stopPropagation();
    let selectedRef = this.searcher.getSelectedResult();
    // Do not request the reference content again until the current fetch has
    // finished (e.g. if the user clicks the Copy link multiple times)
    if (this.searcher.isCopyingContent) {
      return;
    }
    try {
      await this.searcher.copy(selectedRef);
      this.postNotification({
        title: 'Copied!',
        message: `${selectedRef.name} copied to the clipboard`
      });
      m.redraw();
    } catch (error) {
      this.postNotification({
        title: 'Error',
        message: `Could not copy ${selectedRef.name} to the clipboard`
      });
      m.redraw();
    }
  }

  // Spawn a browser notification with the given parameters
  postNotification(params) {
    chrome.notifications.create(
      Object.assign(
        {
          type: 'basic',
          iconUrl: 'icons/icon-square.png'
        },
        params
      )
    );
  }

  view() {
    return (
      <div className="popup">
        <header className="popup-header">
          <a href="options.html" target="_blank">
            <OptionsIconComponent />
          </a>
          <h1 className="popup-title">YouVersion Suggest</h1>
          <SearchFieldComponent
            searcher={this.searcher}
            autofocus={true}
            placeholder="Type a book, chapter, verse, or keyword"
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
            titleKey="name"
            // Optional
            subtitleKey="content"
            actions={[
              {
                linkText: (ref) => (this.searcher.isCopyingContent ? 'Copying...' : 'Copy'),
                onclick: this.copyContentByLink
              }
            ]}
          />
        </div>
      </div>
    );
  }
}

m.mount(document.querySelector('main'), PopupComponent);
