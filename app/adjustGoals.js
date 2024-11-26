import React from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import { IconSymbol } from '@/components/ui/IconSymbol' // Replace with your Icon Component
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function AdjustGoalsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4">
      <ScrollView>
        {/* Header */}
        <View className="flex-row items-center mb-4">
          <Link href={'/(tabs)'} asChild>
            <Pressable className="p-2 bg-gray-200 rounded-full">
              <IconSymbol name="arrow.left" size={24} color="#000" />
            </Pressable>
          </Link>
          <Text className="ml-4 text-xl font-bold">Adjust Goals</Text>
        </View>

        {/* Title */}
        <Text className="text-3xl font-extrabold text-center mb-6">
          Macronutrients
        </Text>

        {/* Goals */}
        <View className="space-y-4 ">
          {[
            {
              label: 'Calorie goal',
              value: '2,417',
              icon: 'flame',
              color: 'black',
            },
            {
              label: 'Protein goal',
              value: '210g',
              icon: 'drumstick',
              color: 'red',
            },
            {
              label: 'Carb goal',
              value: '243g',
              icon: 'leaf',
              color: 'orange',
            },
            { label: 'Fat goal', value: '67g', icon: 'oil.can', color: 'blue' },
          ].map((goal, index) => (
            <View
              key={index}
              className="flex-row items-center bg-white rounded-xl p-4 shadow-lg m-5"
            >
              <View
                className={`w-12 h-12 rounded-full border-4 flex items-center justify-center border-${goal.color}-400`}
              >
                <IconSymbol name={goal.icon} size={20} color={goal.color} />
              </View>
              <View className="ml-4">
                <Text className="text-base text-gray-400">{goal.label}</Text>
                <Text className="text-xl font-bold">{goal.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Auto Generate Goals Button */}
        <Pressable className="bg-black rounded-full py-4 mt-8 mx-auto w-full items-center">
          <Text className="text-white text-lg font-bold">
            Auto Generate Goals
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}
