class SwitchComponent {
  view({ attrs }) {
    return (
      <label className="switch-container">
        <input className="switch-input" type="checkbox" {...attrs} />
        <div className="switch-track">
          <div className="switch-thumb" />
        </div>
      </label>
    );
  }
}

export default SwitchComponent;
