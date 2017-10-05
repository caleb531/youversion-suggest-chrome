import autoBind from 'auto-bind';
import m from 'mithril';
import OptionsMenuComponent from './options-menu';

class VersionPickerComponent {

  constructor({attrs}) {
    Object.assign(this, attrs);
    autoBind(this);
  }

  setPreferredVersion(changeEvent) {
    changeEvent.redraw = false;
    this.versionPicker.setPreferredVersion(Number(changeEvent.target.value));
  }

  view() {
    return m('div.options-field.version-picker-container', [
      m('.options-cell', (
        m('label[for="version-picker"]', 'Version:')
      )),
      m('.options-cell', m(OptionsMenuComponent, {
        id: 'version-picker',
        options: this.versionPicker.versions,
        value: this.versionPicker.preferredVersion,
        onchange: this.setPreferredVersion
      }))
    ]);
  }

}

export default VersionPickerComponent;
