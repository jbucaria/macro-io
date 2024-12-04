import { useCallback, useState } from 'react'
import { useNutritionAdvisor } from '@/src/hooks/useNutritionAdvisor'
import { launchImageLibrary } from 'react-native-image-picker'
import { Keyboard } from 'react-native'

export const useChat = () => {
  const {
    messages,
    configureStatus,
    sending,
    ingredientAdvisorResponse,
    fetchIngredients,
    sendMessage,
    setIngredientAdvisorResponse,
    sendImage,
  } = useNutritionAdvisor()

  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const onChangeTextInput = useCallback(val => {
    setInputMessage(val)
  }, [])

  const onPressSendBtn = useCallback(() => {
    sendMessage(inputMessage)
    setInputMessage('')
    Keyboard.dismiss()
  }, [inputMessage, sendMessage])

  const onPressPlusIcon = useCallback(async () => {
    try {
      const { assets } = await launchImageLibrary({ mediaType: 'photo' })
      if (assets) {
        sendImage(assets?.[0]?.uri?.replace('file://', '') || '')
      }
    } catch (err) {
      setLoading(false)
      console.error('Error selecting image:', err)
    }
  }, [sendImage])

  const onCloseIngredientView = useCallback(() => {
    setIngredientAdvisorResponse(null)
  }, [setIngredientAdvisorResponse])

  return {
    configureStatus,
    ingredientAdvisorResponse,
    inputMessage,
    messages,
    loading,
    sending,
    onChangeTextInput,
    onPressSendBtn,
    onPressPlusIcon,
    fetchIngredients,
    onCloseIngredientView,
  }
}
