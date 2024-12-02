import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Pressable,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import { Link } from 'expo-router'
import { IconSymbol } from '@/src/components/ui/IconSymbol' // Replace with your icon implementation
import FoodItemDetails from '@/src/components/FoodItemDetail'

const FoodSearchScreen = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query) return
    setLoading(true)
    try {
      const tokenResponse = await axios.post(
        'https://api.passiolife.com/v2/token-cache/napi/oauth/token/1i5eXnFpiRfiBGgLibonnBg10Ct14nALTAK5Jb6B4V4o'
      )
      const { access_token, customer_id } = tokenResponse.data

      const headers = {
        Authorization: `Bearer ${access_token}`,
        'Passio-ID': customer_id,
      }

      const response = await axios.get(
        `https://api.passiolife.com/v2/products/napi/food/search/advanced?term=${encodeURIComponent(
          query
        )}`,
        { headers }
      )
      setResults(response.data.results)
    } catch (error) {
      console.error('Error fetching food data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 px-4">
      {/* Header Section */}
      <View className="flex-row items-center mb-4">
        <Link href={'/(tabs)'} asChild>
          <Pressable className="p-2 bg-gray-200 rounded-full">
            <IconSymbol name="arrow.left" size={24} color="#000" />
          </Pressable>
        </Link>
        <Text className="ml-4 text-xl font-bold">Food Search</Text>
      </View>

      {/* Input Section */}
      <TextInput
        className="h-12 bg-white rounded-lg px-4 mb-4 border border-gray-300 text-base"
        placeholder="Enter food name..."
        value={query}
        onChangeText={setQuery}
      />
      <Pressable
        className={`py-3 rounded-lg ${loading ? 'bg-gray-300' : 'bg-blue-500'}`}
        onPress={handleSearch}
        disabled={loading}
      >
        <Text className="text-center text-white text-base font-bold">
          {loading ? 'Loading...' : 'Search'}
        </Text>
      </Pressable>

      {/* Results Section */}
      {results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={item => item.resultId}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => console.log('Selected:', item.displayName)}
              className="bg-white p-4 rounded-lg mb-2 shadow"
            >
              <FoodItemDetails foodItem={item} />
            </TouchableOpacity>
          )}
          className="mt-4"
        />
      ) : (
        !loading && (
          <Text className="text-center text-gray-500 mt-8">
            No results found.
          </Text>
        )
      )}
    </SafeAreaView>
  )
}

export default FoodSearchScreen
