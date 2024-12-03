import { PassioSDK } from '@passiolife/nutritionai-react-native-sdk-v2'
import { useState, useEffect } from 'react'

const MyComponent = () => {
  const [loadingState, setLoadingState] = useState('')
  const [isCameraAuthorized, setCameraAuthorized] = useState(false)

  useEffect(() => {
    async function configure() {
      try {
        const status = await PassioSDK.configure({
          key: process.env.PassioSDK, // Replace with your Passio license key
          debugMode: false, // Set to true for debugging output
          autoUpdate: true, // Set to true to enable auto-download of AI models
          remoteOnly: false, // Set to true if you want to use only remote recognition
        })

        switch (status.mode) {
          case 'notReady':
            console.warn('SDK not ready. Missing model files.')
            break
          case 'isReadyForDetection':
            setLoadingState('ready')
            console.log('SDK is ready for detection')
            break
          case 'error':
            console.error(`PassioSDK Error: ${status.errorMessage}`)
            setLoadingState('error')
            break
        }
      } catch (err) {
        console.error(`PassioSDK Error: ${err}`)
        setLoadingState('error')
      }
    }

    configure()
  }, [])

  // Request camera permission
  useEffect(() => {
    PassioSDK.requestCameraAuthorization().then(cameraAuthorized => {
      setCameraAuthorized(cameraAuthorized)
    })
  }, [])

  return (
    // Your component's JSX here
    <>
      {loadingState === 'ready' && isCameraAuthorized && (
        <div>Ready for Food Detection</div>
      )}
      {loadingState === 'error' && <div>Error configuring Passio SDK</div>}
    </>
  )
}
