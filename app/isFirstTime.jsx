import AsyncStorage from '@react-native-async-storage/async-storage';

export const getItemFor = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error('Error getting item from AsyncStorage', error);
    throw error;
  }
};

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Error storing item in AsyncStorage', error);
    throw error;
  }
};




    

