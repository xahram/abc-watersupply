import { useContext } from "react";
import SettingsContext from "../context/SettingContext";

export default function useSettings() {
  const context = useContext(SettingsContext);
  console.log(context);
  return context;
}
