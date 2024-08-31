import m from 'mithril';
import BooleanFieldComponent from './boolean-field.jsx';
import LanguagePickerComponent from './language-picker.jsx';
import LanguagePicker from './models/language-picker.js';
import { getPreferences, setPreferences } from './models/preferences.js';
import VersionPicker from './models/version-picker.js';
import VersionPickerComponent from './version-picker.jsx';

class OptionsComponent {
  constructor() {
    this.languagePicker = new LanguagePicker();
    this.versionPicker = new VersionPicker();
    this.loadPreferences();
  }

  async loadPreferences() {
    this.preferences = await getPreferences();
    await this.languagePicker.loadLanguages();
    const preferredLanguage = await this.languagePicker.loadPreferredLanguage();
    await this.versionPicker.loadVersions({ language: preferredLanguage });
    await this.versionPicker.loadPreferredVersion();
    m.redraw();
  }

  async handlePreferenceUpdate(event, valuePropName = 'value') {
    const preferenceId = event.currentTarget.name || event.currentTarget.id;
    await setPreferences({ [preferenceId]: event.currentTarget[valuePropName] });
    this.preferences = await getPreferences();
    m.redraw();
  }

  view() {
    return (
      <div className="options-page">
        <header className="options-header">
          <img
            className="options-header-logo"
            src="icons/icon-square.svg"
            alt="YouVersion Suggest"
          />
          <div className="options-header-headings">
            <h1 className="app-title">YouVersion Suggest</h1>
            <h2 className="options-page-title">Settings</h2>
          </div>
        </header>

        {this.languagePicker.languages && this.versionPicker.versions && this.preferences ? (
          <div className="options-fields">
            <LanguagePickerComponent
              languagePicker={this.languagePicker}
              versionPicker={this.versionPicker}
            />
            <VersionPickerComponent versionPicker={this.versionPicker} />
            <BooleanFieldComponent
              id="versenumbers"
              label="Include Verse Numbers?"
              preferences={this.preferences}
              onchange={(event) => this.handlePreferenceUpdate(event, 'checked')}
            />
            <BooleanFieldComponent
              id="linebreaks"
              label="Include Line Breaks?"
              preferences={this.preferences}
              onchange={(event) => this.handlePreferenceUpdate(event, 'checked')}
            />
          </div>
        ) : null}

        <p className="options-save-note">Preferences are saved automatically</p>
      </div>
    );
  }
}

m.mount(document.querySelector('main'), OptionsComponent);
