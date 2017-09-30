import m from 'mithril';
import Core from './models/core';
import OptionsMenuComponent from './options-menu';

class OptionsComponent {

  constructor() {
    Core.getPreferences()
      .then((preferences) => {
        this.preferences = preferences;
        return Core.getLanguages();
      })
      .then((languages) => {
        this.languages = languages;
        return this.reloadVersions();
      })
      .then(() => m.redraw());
  }

  reloadVersions() {
    return Core.getBibleLanguageData(this.preferences.language)
      .then((bible) => {
        this.versions = bible.versions;
        this.defaultVersion = bible.default_version;
      });
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

      this.languages && this.versions && this.preferences ?
      m('div.options-fields', [

        m('div.options-field.language-picker-container', [
          m('.options-cell', (
            m('label[for="language-picker"]', 'Language:')
          )),
          m('.options-cell', m(OptionsMenuComponent, {
            id: 'language-picker',
            options: this.languages,
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
            options: this.versions,
            preferences: this.preferences,
            preferenceKey: 'version'
          }))
        ])

      ]) : null

    ]);
  }

}

m.mount(document.querySelector('main'), OptionsComponent);
