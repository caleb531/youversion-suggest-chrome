class SearchClearButton {
  view({ attrs }) {
    return (
      <button
        className="search-clear-button"
        onmousedown={(mouseEvent) => {
          mouseEvent.preventDefault();
        }}
        onmouseup={(mouseEvent) => {
          mouseEvent.preventDefault();
          attrs.onclear(mouseEvent);
        }}
      >
        <svg viewBox="0 -960 960 960" className="search-clear-button-icon">
          <path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z" />
        </svg>
      </button>
    );
  }
}

export default SearchClearButton;
