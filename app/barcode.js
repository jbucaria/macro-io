import React from 'react'
import { View, Text } from 'react-native'
import { Link } from 'expo-router'

const barcode = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Text>Barcode</Text>
      <View className="p-8">
        <Link href={'/(tabs)'} asChild>
          <Text className="font-bold text-red-500 text-4xl">Go Home</Text>
        </Link>
      </View>
    </View>
  )
}

export default barcode
