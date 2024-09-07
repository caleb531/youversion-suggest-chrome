import SearchClearButtonComponent from './search-clear-button.jsx';
import SearchIconComponent from './search-icon.jsx';

// A generic autocomplete-based search field
class SearchFieldComponent {
  oninit({ attrs }) {
    this.searcher = attrs.searcher;
  }

  // Run the main search function as soon as the search field contents change
  triggerSearch(inputEvent) {
    this.searcher.search(inputEvent.target.value);
    inputEvent.redraw = false;
  }

  clearSearch(mouseEvent) {
    this.searcher.clearSearch();
  }

  view({ attrs }) {
    return (
      <div className="search-field-container">
        <input
          type="text"
          className="search-field"
          autoFocus={attrs.autofocus}
          placeholder={attrs.placeholder}
          value={this.searcher.queryStr}
          oninput={(event) => this.triggerSearch(event)}
        />
        <SearchIconComponent />
        {this.searcher.queryStr ? (
          <SearchClearButtonComponent onclear={(mouseEvent) => this.clearSearch(mouseEvent)} />
        ) : null}
      </div>
    );
  }
}

export default SearchFieldComponent;
