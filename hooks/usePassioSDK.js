// hooks/usePassioSDK.js
import { useState, useEffect } from 'react'
import { PassioSDK } from '@passiolife/nutritionai-react-native-sdk-v3'

const usePassioSDK = () => {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Configure the SDK with your developer key
    const configureSDK = async () => {
      try {
        const [sdkStatus, cameraAuthorized] = await Promise.all([
          PassioSDK.configure({
            key: process.env.PASSIO_API_KEY,
            autoUpdate: true, // Set to true to automatically download updates
          }),
          PassioSDK.requestCameraAuthorization(), // Request camera permissions if needed
        ])

        // Set SDK status
        setIsReady(sdkStatus.mode === 'isReadyForDetection' && cameraAuthorized)
      } catch (error) {
        console.error('Error configuring SDK:', error)
      }
    }

    configureSDK()
  }, [])

  return { isReady, PassioSDK }
}

export default usePassioSDK
