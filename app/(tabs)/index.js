import React, { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { IconSymbol } from '@/components/ui/IconSymbol'
import ActionModal from '@/components/ActionModal'
import { Link } from 'expo-router'

export default function App() {
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <View className="m-2 p-4 rounded-lg bg-white ">
        <Text>Home</Text>
      </View>
      <View className="absolute bottom-32 right-10 w-16 h-16  flex items-center justify-center">
        <Pressable onPress={() => setModalVisible(true)}>
          <IconSymbol
            name="plus.circle.fill"
            size={90}
            weight="semibold"
            color="black"
          />
        </Pressable>
        <ActionModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          closeModal={() => setModalVisible(false)}
        />
      </View>
    </View>
  )
}
