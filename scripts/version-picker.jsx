import OptionsFieldComponent from './options-field.jsx';
import OptionsMenuComponent from './options-menu.jsx';

class VersionPickerComponent {
  constructor({ attrs }) {
    Object.assign(this, attrs);
  }

  setPreferredVersion(changeEvent) {
    changeEvent.redraw = false;
    this.versionPicker.setPreferredVersion(Number(changeEvent.target.value));
  }

  view() {
    return (
      <OptionsFieldComponent
        id={this.id}
        label="Version"
        control={
          <OptionsMenuComponent
            id={this.id}
            options={this.versionPicker.versions}
            value={this.versionPicker.preferredVersion}
            onchange={(event) => this.setPreferredVersion(event)}
          />
        }
      />
    );
  }
}
VersionPickerComponent.prototype.id = 'version';

export default VersionPickerComponent;
