// FILE: /app/settings.js

import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import auth from '@react-native-firebase/auth'
import { Link } from 'expo-router'
import UserProfile from '@/src/components/userProfile' // Import the UserProfile component

const settings = () => {
  const handleLogout = async () => {
    try {
      await auth().signOut()
    } catch (error) {
      console.error('Error signing out: ', error)
    }
  }

  return (
    <View className="flex-1 justify-center items-center">
      <Text>Settings</Text>
      <UserProfile />
      <View className="p-8">
        <Link href={'/(tabs)'} asChild>
          <Text className="font-bold text-red-500 text-4xl">Go Home</Text>
        </Link>
        <Link href={'/login'} asChild>
          <Text className="font-bold text-blue-500 text-4xl">Login</Text>
        </Link>
        <TouchableOpacity onPress={handleLogout}>
          <Text className="font-bold text-green-500 text-4xl">Sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default settings
