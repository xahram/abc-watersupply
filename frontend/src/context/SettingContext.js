import { createContext, useState } from "react";
import _ from "lodash";
import { THEMES } from "../constants/index";
// import { storeSettings } from "src/utils/settings";

const SettingsContext = createContext();

const defaultSettings = {
  direction: "ltr",
  responsiveFontSizes: true,
  theme: THEMES.LIGHT,
};
export function SettingsProvider({ children }) {
  const [currentSettings, setCurrentSettings] = useState(defaultSettings);

  const handleSaveSettings = (updatedSettings = {}) => {
    const mergedSettings = _.merge({}, currentSettings, updatedSettings);

    setCurrentSettings(mergedSettings);
    // storeSettings(mergedSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings: currentSettings,
        saveSettings: handleSaveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}


export const SettingsConsumer = SettingsContext.Consumer;

export default SettingsContext;