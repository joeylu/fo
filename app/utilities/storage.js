import * as SecureStore from 'expo-secure-store';


export async function Save(key, value) {    
  try {
      await SecureStore.setItemAsync(key.toString(), value.toString());
  } catch (e) {
    console.log("error saving data: " + e);
  }
}
export async function Load(key) {
  try {
    if (key)
      return await SecureStore.getItemAsync(key.toString());
  } catch (e) {
    console.log("error loading data: " + e);
    return("");
  }
}