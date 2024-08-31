// Retrieve the raw user preferences without defaults merged in
export function getRawPreferences() {
  return new Promise((resolve) => {
    chrome.storage.sync.get('preferences', (items) => {
      resolve(items.preferences);
    });
  });
}

// Retrieve the map of default values for user preferences
export function getDefaultPreferences() {
  return {
    language: 'eng',
    version: 111,
    refformat: '{name} ({version})\n\n{content}',
    versenumbers: false,
    linebreaks: true
  };
}

// Get the final preferences object (stored user data merged with defaults)
export function getPreferences() {
  return Promise.all([getDefaultPreferences(), getRawPreferences()]).then(
    ([defaultPrefs, rawPrefs]) => {
      return Object.assign({}, defaultPrefs, rawPrefs);
    }
  );
}

// Merge the given preferences into the persisted user preferences object
export function setPreferences(prefsToUpdate) {
  return getPreferences().then((currentPrefs) => {
    let newPrefs = Object.assign(currentPrefs, prefsToUpdate);
    return new Promise((resolve) => {
      chrome.storage.sync.set({ preferences: newPrefs }, () => {
        resolve(newPrefs);
      });
    });
  });
}
