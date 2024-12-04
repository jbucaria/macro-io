import { PassioSDK } from '@passiolife/nutritionai-react-native-sdk-v3'

const configurePassioSDK = async () => {
  try {
    const status = await PassioSDK.configure({
      key: '9DNuQvuKEnyROsSAe4a7BLZ3fCbptYn0nCWnZquo', // Replace with your Passio license key
      debugMode: false, // Set to true to enable debug logs
      autoUpdate: true, // Enable automatic model updates
      remoteOnly: false, // Set to true for only remote recognition
    })

    return status
  } catch (err) {
    console.error(`PassioSDK Error: ${err}`)
    throw err
  }
}

const requestCameraAuthorization = async () => {
  try {
    const isAuthorized = await PassioSDK.requestCameraAuthorization()
    return isAuthorized
  } catch (err) {
    console.error('Camera authorization request failed:', err)
    return false
  }
}

const startFoodDetection = (config, onDetectionCallback) => {
  const subscription = PassioSDK.startFoodDetection(config, onDetectionCallback)
  return subscription
}

export { configurePassioSDK, requestCameraAuthorization, startFoodDetection }
