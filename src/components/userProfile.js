// FILE: /app/components/UserProfile.js

import React from 'react'
import { View, Text } from 'react-native'
import useStore from '@/src/store/useStore' // Import the Zustand store

const UserProfile = () => {
  const user = useStore(state => state.user)

  if (!user) {
    return <Text>No user logged in</Text>
  }

  return (
    <View>
      <Text>Email: {user.email}</Text>
      <Text>Display Name: {user.displayName}</Text>
    </View>
  )
}

export default UserProfile
