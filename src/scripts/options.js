import m from 'mithril';
import Core from './models/core';
import LoadingIconComponent from './components/loading-icon';

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

      m('div.options-fields', [

        m('div.option-field.language-picker-container', [
          m('.option-cell', (
            m('label[for="language-picker"]', 'Language:')
          )),
          m('.option-cell', [
            this.languages && this.preferences ?
            m('select#language-picker',
              this.languages.map((language) => {
                return m('option', {
                  value: language.id,
                  selected: language.id === this.preferences.language
                }, language.name);
              })
            ) : m('div.options-loading-icon-container', m(LoadingIconComponent))
          ])
        ]),

        m('div.option-field.version-picker-container', [
          m('.option-cell', (
            m('label[for="version-picker"]', 'Version:')
          )),
          m('.option-cell', [
            this.versions && this.preferences ?
            m('select#version-picker',
              this.versions.map((version) => {
                return m('option', {
                  value: version.id,
                  selected: version.id === this.preferences.version
                }, version.name);
              })
            ) : m('div.options-loading-icon-container', m(LoadingIconComponent))
          ])
        ])

      ])

    ]);
  }

}

m.mount(document.querySelector('main'), OptionsComponent);
