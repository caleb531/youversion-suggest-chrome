import m from 'mithril';
import LanguagePicker from './models/language-picker.js';
import VersionPicker from './models/version-picker.js';
import LanguagePickerComponent from './language-picker.js';
import VersionPickerComponent from './version-picker.js';

class OptionsComponent {

  constructor() {
      this.languagePicker = new LanguagePicker();
      this.versionPicker = new VersionPicker();
      this.languagePicker.loadLanguages()
        .then(() => this.languagePicker.loadPreferredLanguage())
        .then((preferredLanguage) => {
          return this.versionPicker.loadVersions({language: preferredLanguage});
        })
        .then(() => this.versionPicker.loadPreferredVersion())
        .then(() => m.redraw());
  }

  view() {
    return m('div.options-page', [

      m('header.options-header', [
        m('img.options-header-logo', {
          src: 'icons/icon-square.svg',
          alt: 'YouVersion Suggest'
        }),
        m('div.options-header-headings', [
          m('h1.app-title', 'YouVersion Suggest'),
          m('h2.options-page-title', 'Preferences')
        ])
      ]),

      this.languagePicker.languages && this.versionPicker.versions ?
      m('div.options-fields', [

        m(LanguagePickerComponent, {
          languagePicker: this.languagePicker,
          versionPicker: this.versionPicker
        }),
        m(VersionPickerComponent, {
          versionPicker: this.versionPicker,
        }),

      ]) : null,

      m('p.options-save-note', 'Preferences are saved automatically')

    ]);
  }

}

m.mount(document.querySelector('main'), OptionsComponent);
