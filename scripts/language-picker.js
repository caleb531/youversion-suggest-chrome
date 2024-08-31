import autoBind from 'auto-bind';
import m from 'mithril';
import OptionsMenuComponent from './options-menu.js';

class LanguagePickerComponent {

  constructor({attrs}) {
    Object.assign(this, attrs);
    autoBind(this);
  }

  setPreferredLanguage(changeEvent) {
    changeEvent.redraw = false;
    let newLanguage = changeEvent.target.value;
    this.languagePicker.setPreferredLanguage(newLanguage)
      .then(() => this.versionPicker.loadVersions({language: newLanguage}))
      .then(() => {
        // Every time the language is changed, the version is set to the default
        // version for that language
        this.versionPicker.setPreferredVersion(this.versionPicker.defaultVersion);
        m.redraw();
      });
  }

  view() {
    return m('div.options-field.language-picker-container', [
      m('.options-cell', (
        m('label[for="language-picker"]', 'Language:')
      )),
      m('.options-cell', m(OptionsMenuComponent, {
        id: 'language-picker',
        options: this.languagePicker.languages,
        value: this.languagePicker.preferredLanguage,
        onchange: this.setPreferredLanguage
      }))
    ]);
  }

}

export default LanguagePickerComponent;
