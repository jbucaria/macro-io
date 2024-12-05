import { useState, useCallback, useEffect, useMemo } from 'react'
import { PassioSDK } from '@passiolife/nutritionai-react-native-sdk-v3'

const useMealPlan = ({ onFoodDetail }) => {
  // State variables
  const [passioMealPlan, setPassioMealPlan] = useState()
  const [selectedDay, setSelectedDay] = useState(0)
  const [passioMealPlans, setPassioMealPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const [passioMealPlanItem, setPassioMealPlanItem] = useState(null)

  const generateDaysData = useMemo(() => {
    const days = []
    for (let i = 1; i <= 14; i++) {
      days.push(`Day ${i}`)
    }
    return days
  }, [])

  const onChangeDay = useCallback(day => {
    setSelectedDay(day)
  }, [])

  useEffect(() => {
    async function init() {
      try {
        setLoading(true)
        setPassioMealPlanItem([])
        setPassioMealPlans([])
        // Fetch food results from the PassioSDK based on the query
        const mealPlans = await PassioSDK.fetchMealPlans()
        if (mealPlans) {
          setPassioMealPlans(mealPlans)
          const initial = mealPlans[0]
          if (initial) {
            setPassioMealPlan(initial)
          }
        }
      } catch (error) {
        setPassioMealPlans([])
        setPassioMealPlanItem([])
      } finally {
        // Reset loading state to indicate the end of the search
        setLoading(false)
      }
    }
    init()
  }, [])

  useEffect(() => {
    async function init() {
      try {
        setLoading(true)
        setPassioMealPlanItem([])
        if (passioMealPlan?.mealPlanLabel) {
          const mealPlans = await PassioSDK.fetchMealPlanForDay(
            passioMealPlan?.mealPlanLabel,
            selectedDay + 1
          )
          setPassioMealPlanItem(mealPlans)
        }
      } catch (error) {
        // Handle errors, e.g., network issues or API failures
        setPassioMealPlanItem([])
      } finally {
        // Reset loading state to indicate the end of the search
        setLoading(false)
      }
    }
    init()
  }, [passioMealPlan, passioMealPlan?.mealPlanLabel, selectedDay])

  const onResultItemPress = useCallback(
    async foodSearchResult => {
      let result = await PassioSDK.fetchFoodItemForDataInfo(foodSearchResult)

      if (result) {
        if (foodSearchResult.nutritionPreview?.weightUnit) {
          result.amount.weight = {
            unit: foodSearchResult.nutritionPreview?.weightUnit,
            value: foodSearchResult.nutritionPreview?.weightQuantity ?? 0,
          }
          result.amount.selectedUnit =
            foodSearchResult.nutritionPreview?.servingUnit
          result.amount.selectedQuantity =
            foodSearchResult.nutritionPreview?.servingQuantity ?? 0
        }

        onFoodDetail(result)
      }
    },
    [onFoodDetail]
  )

  const onChangeMeal = plan => {
    setPassioMealPlan(plan)
  }

  return {
    passioMealPlanItem,
    passioMealPlans,
    onChangeMeal,
    loading,
    onResultItemPress,
    passioMealPlan,
    generateDaysData,
    onChangeDay,
    selectedDay,
  }
}

export default useMealPlan
