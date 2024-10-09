import { Injectable } from "@angular/core";
import { KeysResult, Preferences } from "@capacitor/preferences";

Injectable({
  providedIn: "root"
});

export class PreferencesService{

  async setPref(key:string, value:string): Promise<void>{
    await Preferences.set({key: key, value: value});
  }

  async getPref(key:string): Promise<string | null> {
    const { value } = await Preferences.get({key: key});
    return value;
  }

  async deletePref(key:string): Promise<void>{
    await Preferences.remove({key: key});
  }

  async deleteOldPref(): Promise<void> {
    await Preferences.removeOld();
  }

  async clearPrefs(): Promise<void>{
    await Preferences.clear();
  }

  async keysPrefs(): Promise<KeysResult>{
    return await Preferences.keys();
  }
}