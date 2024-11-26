import React from 'react'
import { View, Text } from 'react-native'

import { Link } from 'expo-router'

const settings = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Link href={'/adjustGoals'} asChild>
        <Text>Go to adjust goals</Text>
      </Link>
    </View>
  )
}

export default settings
