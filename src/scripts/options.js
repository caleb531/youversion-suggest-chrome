import m from 'mithril';
import Core from './models/core';
import LanguagePicker from './models/language-picker';
import VersionPicker from './models/version-picker';
import LanguagePickerComponent from './language-picker';
import VersionPickerComponent from './version-picker';

class OptionsComponent {

  constructor() {
    Core.getPreferences()
      .then((preferences) => {
        this.preferences = preferences;
        this.languagePicker = new LanguagePicker({
          preferences: this.preferences
        });
        this.versionPicker = new VersionPicker({
          preferences: this.preferences
        });
      })
      .then(() => this.languagePicker.getOptions())
      .then(() => this.versionPicker.getOptions())
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

      this.languagePicker && this.versionPicker && this.preferences ?
      m('div.options-fields', [

        m(LanguagePickerComponent, {
          languagePicker: this.languagePicker,
          versionPicker: this.versionPicker,
          preferences: this.preferences
        }),
        m(VersionPickerComponent, {
          versionPicker: this.versionPicker,
          preferences: this.preferences
        }),

      ]) : null

    ]);
  }

}

m.mount(document.querySelector('main'), OptionsComponent);
