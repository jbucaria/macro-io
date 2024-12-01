import React from 'react'
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import auth from '@react-native-firebase/auth'

const home = () => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <Text>Welcome</Text>
      <TouchableOpacity
        onPress={() =>
          auth()
            .signOut()
            .then(() => setUser(null))
        }
      >
        <Text>Sign out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default home
