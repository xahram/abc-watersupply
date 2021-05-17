import { useContext } from "react";
import SettingsContext from "../context/SettingContext";

export default function useSettings() {
  const context = useContext(SettingsContext);
  console.log('[useSettings.js line no 6]',context);
  return context;
}
