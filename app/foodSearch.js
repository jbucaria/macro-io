import React from 'react'
import { View, Text } from 'react-native'
import { Link } from 'expo-router'

const foodSearch = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Text>Food Search</Text>
      <Link href={'/(tabs)'} asChild>
        <Text>Go Home</Text>
      </Link>
    </View>
  )
}

export default foodSearch
