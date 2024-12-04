import { useEffect, useState } from 'react'
import {
  NutritionAdvisor,
  PassioAdvisorMessageResultStatus,
} from '@passiolife/nutritionai-react-native-sdk-v3'

export const useNutritionAdvisor = () => {
  const [configureStatus, setConfigureStatus] = useState('Init') // SDKStatus
  const [messages, setMessages] = useState([]) // ChatEntity[]
  const [sending, setSending] = useState(false)
  const [ingredientAdvisorResponse, setIngredientAdvisorResponse] =
    useState(null) // PassioAdvisorResponse | null

  useEffect(() => {
    const initializeNutritionAdvisor = async () => {
      try {
        const conversationResponse = await NutritionAdvisor.initConversation()
        setConfigureStatus(
          conversationResponse?.status === 'Success' ? 'Success' : 'Error'
        )
      } catch (err) {
        console.error(`PassioSDK Error: ${err}`)
        setConfigureStatus('Error')
      }
    }

    initializeNutritionAdvisor()
  }, [])

  const handleAdvisorResponse = (response, message) => {
    setMessages(items => {
      if (response?.status === 'Success') {
        const chatResponse = {
          type: 'response',
          response: response.response,
        }
        return [...items.filter(it => it.type !== 'typing'), chatResponse]
      } else {
        const chatResponse = {
          type: 'response',
          response: null,
          message,
          error: response?.message,
        }
        return [...items.filter(it => it.type !== 'typing'), chatResponse]
      }
    })
  }

  const sendMessage = async message => {
    setMessages(items => [
      ...items,
      { type: 'text', message },
      { type: 'typing' },
    ])
    setSending(true)

    try {
      const response = await NutritionAdvisor.sendMessage(message)
      handleAdvisorResponse(response, message)
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setSending(false)
    }
  }

  const sendImage = async imgUrl => {
    setMessages(items => [
      ...items,
      { type: 'image', uri: imgUrl },
      { type: 'typing' },
    ])
    setSending(true)

    try {
      const response = await NutritionAdvisor.sendImage(imgUrl)
      handleAdvisorResponse(response, imgUrl)
    } catch (err) {
      console.error('Error sending image:', err)
    } finally {
      setSending(false)
    }
  }

  const fetchIngredients = async response => {
    setSending(true)

    try {
      const responseOfIngredients = await NutritionAdvisor.fetchIngredients(
        response
      )
      if (responseOfIngredients?.status === 'Success') {
        setIngredientAdvisorResponse(responseOfIngredients.response)
      } else {
        console.error(
          'Failed to fetch ingredients:',
          responseOfIngredients?.message
        )
      }
    } catch (err) {
      console.error('Error fetching ingredients:', err)
    } finally {
      setSending(false)
    }
  }

  return {
    configureStatus,
    messages,
    ingredientAdvisorResponse,
    sending,
    sendMessage,
    sendImage,
    fetchIngredients,
    setIngredientAdvisorResponse,
  }
}
