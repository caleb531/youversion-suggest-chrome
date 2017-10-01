import autoBind from 'auto-bind';
import m from 'mithril';
import OptionsMenuComponent from './options-menu';

class LanguagePickerComponent {

  constructor({attrs}) {
    Object.assign(this, attrs);
    autoBind(this);
  }

  setLanguage(changeEvent) {
    changeEvent.redraw = false;
    this.languagePicker.setOption(changeEvent.target.value)
      .then(() => this.versionPicker.getOptions())
      .then(() => {
        // Every time the language is changed, the version is set to the default
        // version for that language
        this.versionPicker.setOption(this.versionPicker.defaultOption);
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
        picker: this.languagePicker,
        preferences: this.preferences,
        preferenceKey: 'language',
        onchange: this.setLanguage
      }))
    ]);
  }

}

export default LanguagePickerComponent;
