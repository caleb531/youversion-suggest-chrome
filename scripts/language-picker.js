import autoBind from 'auto-bind';
import m from 'mithril';
import OptionsFieldComponent from './options-field.js';
import OptionsMenuComponent from './options-menu.js';

class LanguagePickerComponent {
  constructor({ attrs }) {
    Object.assign(this, attrs);
    autoBind(this);
  }

  async setPreferredLanguage(changeEvent) {
    changeEvent.redraw = false;
    let newLanguage = changeEvent.target.value;
    await this.languagePicker.setPreferredLanguage(newLanguage);
    await this.versionPicker.loadVersions({ language: newLanguage });
    // Every time the language is changed, the version is set to the default
    // version for that language
    await this.versionPicker.setPreferredVersion(this.versionPicker.defaultVersion);
    m.redraw();
  }

  view() {
    return m(OptionsFieldComponent, {
      id: this.id,
      label: 'Language',
      control: m(OptionsMenuComponent, {
        id: this.id,
        options: this.languagePicker.languages,
        value: this.languagePicker.preferredLanguage,
        onchange: this.setPreferredLanguage
      })
    });
  }
}
LanguagePickerComponent.prototype.id = 'language';

export default LanguagePickerComponent;
