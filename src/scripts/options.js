import m from 'mithril';
import Core from './models/core';
import LoadingIconComponent from './components/loading-icon';

class OptionsComponent {

  constructor() {
    Promise.all([
      Core.getPreferences(),
      Core.getLanguages()
    ])
    .then(([preferences, languages]) => {
      this.preferences = preferences;
      this.languages = languages;
      m.redraw();
    });
  }

  view() {
    return m('div.options-page', [

      m('header.options-header', [
        m('img.options-header-logo', {
          src: 'icons/icon-square.svg',
          alt: 'YouVersion Suggest'
        }),
        m('h1.options-page-title', 'YouVersion Suggest Options')
      ]),

      m('div.options-fields', [
        m('div.option-field.language-picker-container', [
          m('label[for="language-picker"]', 'Language:'),
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
      ])

    ]);
  }

}

m.mount(document.querySelector('main'), OptionsComponent);
