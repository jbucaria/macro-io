import React from 'react'
import { View, Text } from 'react-native'
import { Link } from 'expo-router'

const camera = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Text>Camera</Text>
      <Link href={'/(tabs)'} asChild>
        <Text>Go Home</Text>
      </Link>
    </View>
  )
}

export default camera
