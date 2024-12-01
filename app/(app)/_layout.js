import React from 'react'
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import auth from '@react-native-firebase/auth'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="barcode"
        options={{
          headerShown: false,
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  )
}

export default _layout
