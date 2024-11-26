import React from 'react'
import { View, Text } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { Link } from 'expo-router'

const settings = () => {
  return (
    <ThemedView className="flex-1 justify-center items-center">
      <Link href={'/adjustGoals'} asChild>
        <Text>Go to adjust goals</Text>
      </Link>
    </ThemedView>
  )
}

export default settings
