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
            <h2 className="options-page-title">Preferences</h2>
          </div>
        </header>

        {this.languagePicker.languages && this.versionPicker.versions ? (
          <div className="options-fields">
            <LanguagePickerComponent
              languagePicker={this.languagePicker}
              versionPicker={this.versionPicker}
            />
            <VersionPickerComponent versionPicker={this.versionPicker} />
          </div>
        ) : null}

        <p className="options-save-note">Preferences are saved automatically</p>
      </div>
    );
  }
}

m.mount(document.querySelector('main'), OptionsComponent);
