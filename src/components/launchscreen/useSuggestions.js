import { useState, useCallback, useEffect } from 'react'
import { PassioSDK } from '@passiolife/nutritionai-react-native-sdk-v3'

const useSuggestions = ({ onFoodDetail }) => {
  // State variables
  const [mealTime, setMealTime] = useState('breakfast')
  const [loading, setLoading] = useState(false)
  const [foodResults, setFoodResults] = useState([])
  const mealTimes = ['breakfast', 'dinner', 'lunch', 'snack']

  // Effect to fetch suggestions based on meal time
  useEffect(() => {
    async function init() {
      try {
        setLoading(true)
        setFoodResults([])
        // Fetch food results from the PassioSDK based on the meal time
        const searchFoods = await PassioSDK.fetchSuggestions(mealTime)
        setFoodResults(searchFoods)
      } catch (error) {
        // Handle errors, e.g., network issues or API failures
        setFoodResults([])
      } finally {
        // Reset loading state to indicate the end of the search
        setLoading(false)
      }
    }
    init()
  }, [mealTime])

  const onResultItemPress = useCallback(
    async foodSearchResult => {
      const result = await PassioSDK.fetchFoodItemForDataInfo(foodSearchResult)
      if (result) {
        onFoodDetail(result)
      }
    },
    [onFoodDetail]
  )

  const onChangeMeal = mealTime => {
    setMealTime(mealTime)
  }

  return {
    foodResults,
    mealTimes,
    onChangeMeal,
    loading,
    onResultItemPress,
    mealTime,
  }
}

export default useSuggestions
