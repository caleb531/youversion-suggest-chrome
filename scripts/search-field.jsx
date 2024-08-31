import autoBind from 'auto-bind';
import m from 'mithril';
import SearchIconComponent from './search-icon.jsx';

// A generic autocomplete-based search field
class SearchFieldComponent {
  constructor({ attrs }) {
    Object.assign(this, attrs);
    autoBind(this);
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
      this.searcher.runDefaultAction(this.searcher.getSelectedResult());
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

  view() {
    return m('div.search-field-container', [
      m('input[type=text].search-field', {
        autofocus: this.autofocus,
        placeholder: this.placeholder,
        value: this.searcher.queryStr,
        onkeydown: this.handleKeyboardNav,
        oninput: this.triggerSearch,
        tabindex: 1
      }),
      m(SearchIconComponent)
    ]);
  }
}

export default SearchFieldComponent;
