import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setStorage(key: string, value: any): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (e) {
    console.error(e);
  }
}

export async function getStorage(key: string): Promise<any> {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      console.error(e);
    }
}

export async function removeStorage(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key)
    } catch(e) {
      console.error(e);
    }
}