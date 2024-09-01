import m from 'mithril';
import OptionsFieldComponent from './options-field.jsx';
import OptionsMenuComponent from './options-menu.jsx';

class LanguagePickerComponent {
  oninit({ attrs }) {
    this.languagePicker = attrs.languagePicker;
    this.versionPicker = attrs.versionPicker;
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

  view({ attrs }) {
    return (
      <OptionsFieldComponent
        id={attrs.id}
        label="Language"
        control={
          <OptionsMenuComponent
            id={attrs.id}
            options={this.languagePicker.languages}
            value={this.languagePicker.preferredLanguage}
            onchange={(event) => attrs.setPreferredLanguage(event)}
          />
        }
      />
    );
  }
}
LanguagePickerComponent.prototype.id = 'language';

export default LanguagePickerComponent;
