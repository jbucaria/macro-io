import { useState, useCallback, useEffect } from 'react'
import { PassioSDK } from '@passiolife/nutritionai-react-native-sdk-v3'
import { useDebounce } from '@/src/hooks/useDebounce'

const useFoodSearch = ({ onFoodDetail }) => {
  // State variables
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [foodResults, setFoodResults] = useState(null)
  const [alternatives, setAlternative] = useState(null)
  const debouncedSearchTerm = useDebounce(searchQuery, 500)

  // Clears search results and resets state
  const cleanSearch = useCallback(() => {
    setSearchQuery('')
    setFoodResults([])
    setLoading(false)
  }, [])

  // Calls the search API based on the input value
  const callSearchApi = useCallback(
    async query => {
      if (query.length > 0) {
        setLoading(true)
        try {
          const searchFoods = await PassioSDK.searchForFood(query)
          setFoodResults(searchFoods?.results || [])
          setAlternative(searchFoods?.alternatives || [])
        } catch (error) {
          console.error('Error fetching search results:', error)
          setFoodResults([])
        } finally {
          setLoading(false)
        }
      } else {
        cleanSearch()
      }
    },
    [cleanSearch]
  )

  // Initiates a new search with the provided query
  const onSearchFood = useCallback(
    async q => {
      if (q.length > 0) {
        setSearchQuery(q)
        setAlternative([])
        setFoodResults([])
      } else {
        cleanSearch()
      }
    },
    [cleanSearch]
  )

  // Effect for handling debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm.length > 0) {
      callSearchApi(debouncedSearchTerm)
    } else {
      cleanSearch()
    }
  }, [callSearchApi, debouncedSearchTerm, cleanSearch])

  // Handles item press event for a search result
  const onSearchResultItemPress = useCallback(
    async foodSearchResult => {
      try {
        const result = await PassioSDK.fetchFoodItemForDataInfo(
          foodSearchResult
        )
        if (result) {
          onFoodDetail(result)
        }
      } catch (error) {
        console.error('Error fetching food item details:', error)
      }
    },
    [onFoodDetail]
  )

  return {
    alternatives,
    cleanSearch,
    foodResults,
    loading,
    onSearchFood,
    onSearchResultItemPress,
    searchQuery,
  }
}

export default useFoodSearch
