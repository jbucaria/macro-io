import { useEffect, useState } from 'react'
import { PassioSDK } from '@passiolife/nutritionai-react-native-sdk-v3'

/**
 * Custom hook for handling quick food scanning using PassioSDK.
 * It provides functions and state variables related to food detection and alternative food items.
 */
export const useQuickNutritionScan = () => {
  const [loading, setLoading] = useState(true)
  const [nutritionFacts, setNutritionFacts] = useState(undefined)

  useEffect(() => {
    // Function to handle food detection events
    const handleFoodDetection = async detection => {
      const { nutritionFacts: facts } = detection

      if (facts !== undefined) {
        setNutritionFacts(facts)
        setLoading(false)
      }
    }

    const subscription =
      PassioSDK.startNutritionFactsDetection(handleFoodDetection)

    // Cleanup function to unsubscribe when the component unmounts
    return () => subscription.remove()
  }, []) // Empty dependency array to run the effect only once during component mount

  // Return the hook's public API
  const onClearResultPress = () => {
    setNutritionFacts(undefined)
  }

  return {
    loading,
    nutritionFacts,
    onClearResultPress,
  }
}
