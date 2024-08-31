import m from 'mithril';

// An options menu for choosing an option
class OptionsMenuComponent {
  constructor({ attrs }) {
    Object.assign(this, attrs);
  }

  view({ attrs }) {
    return (
      <div className="options-menu-container">
        <select id={attrs.id} onchange={attrs.onchange}>
          {attrs.options.map((option) => {
            return (
              <option value={option.id} selected={option.id === attrs.value}>
                {option.name}
              </option>
            );
          })}
        </select>
        <svg viewBox="0 0 16 16" className="options-menu-arrow">
          <path d="M 2,6 L 8,12 L 14,6" />
        </svg>
      </div>
    );
  }
}

export default OptionsMenuComponent;
