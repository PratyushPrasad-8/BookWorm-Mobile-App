import { SplashScreen, Stack,useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router= useRouter();
  const segments= useSegments();
  const {checkAuth, user, token}= useAuthStore();

  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  //Initializing user and token
  useEffect(()=>{
    checkAuth();
  },[]);

  useEffect(()=>{
    if(fontsLoaded) SplashScreen.hideAsync();
  },[fontsLoaded]);

  //Automatic routing to auth or tabs
  useEffect(()=>{
    const inAuthScreen= segments[0]==="(auth)";
    const isSignedIn= user && token;

    if(!inAuthScreen && !isSignedIn) router.replace("/(auth)");
    else if(inAuthScreen && isSignedIn) router.replace("/(tabs)");
  },[user, token, segments]);
  return (
  <SafeAreaProvider>
    <SafeScreen>
      <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)"/>
      <Stack.Screen name="(auth)"/>
    </Stack>
  </SafeScreen>
  <StatusBar style="dark"/>
  </SafeAreaProvider>
  );
}