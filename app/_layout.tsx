import { AuthProvider, useAuth } from '../context/AuthAsyncStorageContext';
import { Slot, Stack, useRouter, useSegments } from 'expo-router';
import { useEffect,useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, Button,Text } from 'react-native';
import CButton from '@/components/CButton';
import { SafeAreaView } from 'react-native-safe-area-context';

const InitialLayout = () => {
  const { authState } = useAuth();
  const segments = useSegments();
  console.log(JSON.stringify(segments));
  const router = useRouter();
  console.log(JSON.stringify(router));
  
  useEffect(() => {
    console.log('isloaded: ', authState?.isLoaded);
    // if (!authState?.isLoaded) return;
 

    const inTabsGroup = segments[0] === '(drawer)';

    console.log('User changed: ', authState?.authenticated);

    if (authState?.authenticated && !inTabsGroup) {
      console.log('pod');
      router.replace('/(drawer)/pod');
      console.log('/pod', JSON.stringify(router));
    } else if (!authState?.authenticated) {
      router.replace('/(public)/login');
      console.log('/login', JSON.stringify(router));      
    }
  }, [authState?.authenticated]);



  return <Stack>
    <Stack.Screen name="index" options={{headerShown:false}} />
    <Stack.Screen
      name='detail'
      options={{
          headerTitle: 'Information',
          headerRight: () => (
            <CButton icon={"check-bold"} onPress={() => router.push("/partDetail" )} title='Arrived' marginRight={3} />)          
      }}
      />
    <Stack.Screen
      name='partDetail'
      options={{
          headerTitle: 'Detail',
          headerRight: () => (
            <CButton icon={"check-bold"} onPress={() => router.push("/delivered")} title='Delivered' marginRight={3} />)          
      }}
    />
    <Stack.Screen
      name='delivered'
      options={{
          headerTitle: 'Signature',        
      }}
    />
    <Stack.Screen
      name='preferences'
      options={{title:'Preferences'}}
      />
    <Stack.Screen name="(drawer)" options={{headerShown:false}}  />

    <Stack.Screen name="(public)" options={{headerShown:false}}  />

  </Stack>;
};
    // <Stack.Screen name="/itr" options={{headerShown:false}}  />
    // <Stack.Screen name="/rfc" options={{headerShown:false}}  />
    // <Stack.Screen name="/pod" options={{headerShown:false}}  />
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const RootLayout = () => {
  return (
    <AuthProvider>
        <InitialLayout />    
    </AuthProvider>
  );
};

export default RootLayout;
