// Retrieve the raw user preferences without defaults merged in
export async function getRawPreferences() {
  const items = await chrome.storage.sync.get('preferences');
  return items.preferences;
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
export async function getPreferences() {
  const [defaultPrefs, rawPrefs] = await Promise.all([
    getDefaultPreferences(),
    getRawPreferences()
  ]);
  return Object.assign({}, defaultPrefs, rawPrefs);
}

// Merge the given preferences into the persisted user preferences object
export async function setPreferences(prefsToUpdate) {
  const currentPrefs = await getPreferences();
  let newPrefs = Object.assign(currentPrefs, prefsToUpdate);
  await chrome.storage.sync.set({ preferences: newPrefs });
  return newPrefs;
}
