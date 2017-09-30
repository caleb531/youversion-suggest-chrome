import m from 'mithril';
import Core from './models/core';
import LanguagePicker from './models/language-picker';
import VersionPicker from './models/version-picker';
import OptionsMenuComponent from './options-menu';

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
      .then(() => this.languagePicker.getLanguages())
      .then(() => this.versionPicker.getVersions())
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

        m('div.options-field.language-picker-container', [
          m('.options-cell', (
            m('label[for="language-picker"]', 'Language:')
          )),
          m('.options-cell', m(OptionsMenuComponent, {
            id: 'language-picker',
            options: this.languagePicker.languages,
            preferences: this.preferences,
            preferenceKey: 'language'
          }))
        ]),

        m('div.options-field.version-picker-container', [
          m('.options-cell', (
            m('label[for="version-picker"]', 'Version:')
          )),
          m('.options-cell', m(OptionsMenuComponent, {
            id: 'version-picker',
            options: this.versionPicker.versions,
            preferences: this.preferences,
            preferenceKey: 'version'
          }))
        ])

      ]) : null

    ]);
  }

}

m.mount(document.querySelector('main'), OptionsComponent);
