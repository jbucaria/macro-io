import 'react-native-reanimated'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { useColorScheme } from '@/src/hooks/useColorScheme'
import { useFonts } from 'expo-font'
import { Slot, Stack, useRouter, useSegments } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View, Text } from 'react-native'
import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native'
import '../global.css'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const segments = useSegments()

  const colorScheme = useColorScheme()

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  const onAuthStateChanged = user => {
    // console.log('onAuthStateChanged', user)
    setUser(user)
    if (initializing) setInitializing(false)
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber
  }, [])

  const inAuthGroup = useSegments()[0]
  useEffect(() => {
    if (initializing) return

    if (!user && inAuthGroup !== '(auth)') {
      router.replace('/(auth)/login')
    } else if (user && inAuthGroup !== '(app)') {
      router.replace('/')
    }
  }, [user, initializing, inAuthGroup])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Slot />
    </ThemeProvider>
  )
}
