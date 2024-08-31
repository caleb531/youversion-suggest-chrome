import m from 'mithril';
import LanguagePickerComponent from './language-picker.jsx';
import LanguagePicker from './models/language-picker.js';
import VersionPicker from './models/version-picker.js';
import VersionPickerComponent from './version-picker.jsx';

class OptionsComponent {
  constructor() {
    this.languagePicker = new LanguagePicker();
    this.versionPicker = new VersionPicker();
    this.loadPreferences();
  }

  async loadPreferences() {
    await this.languagePicker.loadLanguages();
    const preferredLanguage = await this.languagePicker.loadPreferredLanguage();
    await this.versionPicker.loadVersions({ language: preferredLanguage });
    await this.versionPicker.loadPreferredVersion();
    m.redraw();
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

      this.languagePicker.languages && this.versionPicker.versions
        ? m('div.options-fields', [
            m(LanguagePickerComponent, {
              languagePicker: this.languagePicker,
              versionPicker: this.versionPicker
            }),
            m(VersionPickerComponent, {
              versionPicker: this.versionPicker
            })
          ])
        : null,

      m('p.options-save-note', 'Preferences are saved automatically')
    ]);
  }
}

m.mount(document.querySelector('main'), OptionsComponent);
