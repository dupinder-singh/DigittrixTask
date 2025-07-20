import * as Network from 'expo-network';
export const isNetworkAvailable = async (): Promise<boolean> => {
  const state = await  Network.getNetworkStateAsync();
  return state.isConnected ? true : false;
}