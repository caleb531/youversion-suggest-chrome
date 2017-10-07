import autoBind from 'auto-bind';
import m from 'mithril';
import Searcher from './models/searcher';
import SearchFieldComponent from './search-field';
import SearchResultsComponent from './search-results';
import LoadingIconComponent from './loading-icon';

// The extension popup UI
class PopupComponent {

  constructor() {
    // Initialize a new Searcher object, making sure to redraw whenever results
    // are updated
    this.searcher = new Searcher({onUpdateSearchStatus: () => m.redraw()});
    autoBind(this);
  }

  // Copy the content of the selected reference via its action link
  copyContentByLink(clickEvent) {
    let selectedRef = this.searcher.getSelectedResult();
    selectedRef.copy()
      .then(() => {
        this.postNotification({
          title: 'Copied!',
          message: `${selectedRef.name} copied to the clipboard`
        });
        m.redraw();
      })
      .catch(() => {
        this.postNotification({
          title: 'Error',
          message: `Could not copy ${selectedRef.name} to the clipboard`
        });
        m.redraw();
      });
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
        m(SearchFieldComponent, {
          searcher: this.searcher,
          autofocus: true,
          placeholder: 'Type a book, chapter, verse, or keyword'
        })
      ]),

      m('div.popup-content', [

        this.searcher.isLoadingResults ?
        m('div.search-loading-icon-container', m(LoadingIconComponent)) :

        this.searcher.queryStr === '' ?
        m('div.popup-watermark') :

        this.searcher.results.length === 0 ?
        m('div.popup-status-message', 'No Results') : null,

        m(SearchResultsComponent, {
          // Required
          searcher: this.searcher,
          titleKey: 'name',
          // Optional
          subtitleKey: 'content',
          actions: [
            {
              linkText: (ref) => ref.isCopyingContent ? 'Copying...' : 'Copy',
              onclick: this.copyContentByLink,
            }
          ]
        })

      ])
    ]);

  }

}

m.mount(document.querySelector('main'), PopupComponent);
