class OptionsFieldComponent {
  view({ attrs }) {
    return (
      <div className={`options-field option-container-${attrs.id}`}>
        <div className="options-cell">
          <label htmlFor={attrs.id}>{attrs.label}</label>
        </div>
        <div className="options-cell">{attrs.control}</div>
      </div>
    );
  }
}

export default OptionsFieldComponent;
