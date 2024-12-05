import { useState, useCallback, useEffect } from 'react'
import { PassioSDK } from '@passiolife/nutritionai-react-native-sdk-v3'
import { useDebounce } from '@/src/hooks/useDebounce'

const useRecognizeTextRemote = ({ onFoodDetail }) => {
  // State variables
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [passioSpeechRecognitionModel, setPassioSpeechRecognitionModel] =
    useState(null)
  const debouncedSearchTerm = useDebounce(searchQuery, 500)

  // Clears search results and resets state
  const cleanSearch = useCallback(() => {
    setSearchQuery('')
    setPassioSpeechRecognitionModel([])
    setLoading(false)
  }, [])

  // Calls the search API based on the input value
  const callSearchApi = useCallback(
    async query => {
      // Check if the query is not empty
      if (query.length > 0) {
        // Set loading state to indicate the start of the search
        setLoading(true)

        try {
          // Fetch food results from the PassioSDK based on the query
          const searchFoods = await PassioSDK.recognizeSpeechRemote(query)
          setPassioSpeechRecognitionModel(searchFoods)
        } catch (error) {
          // Handle errors, e.g., network issues or API failures
          setPassioSpeechRecognitionModel([])
        } finally {
          // Reset loading state to indicate the end of the search
          setLoading(false)
        }
      } else {
        // If the query is empty, reset the search state
        cleanSearch()
      }
    },
    [cleanSearch]
  )

  // Initiates a new search with the provided query
  const onSpeechRecognition = useCallback(
    async q => {
      if (q.length > 0) {
        setSearchQuery(q)
        setPassioSpeechRecognitionModel([])
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

  const onSearchResultItemPress = useCallback(
    async foodSearchResult => {
      // Achieved Result through `fetchSearchResult`
      const result = await PassioSDK.fetchFoodItemForDataInfo(foodSearchResult)
      if (result) {
        onFoodDetail(result)
      }
    },
    [onFoodDetail]
  )

  return {
    passioSpeechRecognitionModel,
    loading,
    cleanSearch,
    onSpeechRecognition,
    onSearchResultItemPress,
    searchQuery,
  }
}

export default useRecognizeTextRemote
