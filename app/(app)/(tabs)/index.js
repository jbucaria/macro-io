import React, { useState } from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import { IconSymbol } from '@/components/ui/IconSymbol'
import ActionModal from '@/components/ActionModal'
import { Link } from 'expo-router'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function App() {
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <SafeAreaView className="flex-1 bg-gray-100 w-f">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center px-6 py-4">
          <View className="flex-row items-center space-x-2">
            <IconSymbol name="applelogo" size={24} color="#000" />
            <Text className="text-xl font-bold">Macro.io</Text>
          </View>
          <View className="flex-row items-center space-x-4">
            <View className="bg-orange-100 p-2 rounded-full">
              <Text className="text-orange-600 font-bold">🔥 0</Text>
            </View>
          </View>
        </View>

        {/* Date Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 py-2"
        >
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <View key={index} className="flex items-center mx-2">
              <Text className="text-base">{day}</Text>
              <Text className="font-bold text-lg mt-1">{16 + index}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Calorie Tracker */}
        <Link href={'/adjustGoals'} asChild>
          <Pressable>
            <View className="p-6 items-center">
              <View className="bg-white rounded-xl w-full p-6 shadow-lg">
                <Text className="text-4xl font-extrabold">2417</Text>
                <Text className="mt-2 text-base">Calories...</Text>
                <View className="mt-4 flex items-center">
                  <View className="w-20 h-20 border-8 border-gray-200 rounded-full flex items-center justify-center">
                    <IconSymbol name="flame" size={32} color="#000" />
                  </View>
                </View>
              </View>
            </View>
          </Pressable>
        </Link>

        {/* Macro Tracker */}
        <View className="flex-row justify-between px-4 mb-4">
          {[
            { label: 'Protein left', value: '210g', icon: 'drumstick' },
            { label: 'Carbs left', value: '243g', icon: 'leaf' },
            { label: 'Fat left', value: '67g', icon: 'oil.can' },
          ].map((macro, index) => (
            <View
              key={index}
              className="flex items-center bg-white rounded-xl shadow-lg p-4 w-[30%]"
            >
              <Text className="text-2xl font-bold">{macro.value}</Text>
              <Text className="text-sm text-center mt-2">{macro.label}</Text>
              <View className="mt-4">
                <IconSymbol name={macro.icon} size={24} color="#000" />
              </View>
            </View>
          ))}
        </View>

        {/* Prompt Section */}
        <View className="bg-white rounded-xl shadow-lg m-4 p-6">
          <Text className="text-lg font-semibold mb-2">
            You haven't uploaded any meals...
          </Text>
          <Text className="text-base">Start tracking today's meals.</Text>
        </View>
        <View className="bg-white rounded-xl shadow-lg m-4 p-6 ">
          <Text className="text-lg font-semibold mb-2">
            You haven't uploaded any meals...
          </Text>
          <Text className="text-base">Start tracking today's meals.</Text>
        </View>
        <View className="bg-white rounded-xl shadow-lg m-4 p-6 ">
          <Text className="text-lg font-semibold mb-2">
            You haven't uploaded any meals...
          </Text>
          <Text className="text-base">Start tracking today's meals.</Text>
        </View>
        <View className="bg-white rounded-xl shadow-lg m-4 p-6">
          <Text className="text-lg font-semibold mb-2">
            You haven't uploaded any meals...
          </Text>
          <Text className="text-base">Start tracking today's meals.</Text>
        </View>
      </ScrollView>

      <Pressable
        className="absolute bottom-32 right-10 w-16 h-16 bg-black rounded-full flex items-center justify-center"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-4xl text-white">+</Text>
      </Pressable>
      <ActionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        closeModal={() => setModalVisible(false)}
      />
    </SafeAreaView>
  )
}
