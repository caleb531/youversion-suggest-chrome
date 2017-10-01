import autoBind from 'auto-bind';
import m from 'mithril';
import OptionsMenuComponent from './options-menu';

class VersionPickerComponent {

  constructor({attrs}) {
    Object.assign(this, attrs);
    autoBind(this);
  }

  setVersion(changeEvent) {
    changeEvent.redraw = false;
    this.versionPicker.setOption(Number(changeEvent.target.value));
  }

  view() {
    return m('div.options-field.version-picker-container', [
      m('.options-cell', (
        m('label[for="version-picker"]', 'Version:')
      )),
      m('.options-cell', m(OptionsMenuComponent, {
        id: 'version-picker',
        picker: this.versionPicker,
        preferences: this.preferences,
        preferenceKey: 'version',
        onchange: this.setVersion
      }))
    ]);
  }

}

export default VersionPickerComponent;
