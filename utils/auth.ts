import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkAuth = async (): Promise<boolean> => {
  const token = await AsyncStorage.getItem('token');
  return !!token;
};

export const logout = async () => {
  await AsyncStorage.removeItem('token');
};
