import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import {
  PassioSDK,
  DetectionCameraView,
} from '@passiolife/nutritionai-react-native-sdk-v3'

const FoodDetectionApp = () => {
  const [loadingState, setLoadingState] = useState('')
  const [isCameraAuthorized, setCameraAuthorized] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // Initialize the SDK
  useEffect(() => {
    async function configureSDK() {
      try {
        const status = await PassioSDK.configure({
          key: '9DNuQvuKEnyROsSAe4a7BLZ3fCbptYn0nCWnZquo', // Replace with your Passio license key
          debugMode: false, // Set to true to enable debug logs
          autoUpdate: true, // Enable automatic model updates
          remoteOnly: false, // Set to true if only remote recognition is desired
        })

        switch (status.mode) {
          case 'notReady':
            console.warn('SDK is not ready. Missing model files.')
            setLoadingState('notReady')
            break
          case 'isReadyForDetection':
            console.log('SDK is ready for detection')
            setLoadingState('ready')
            setIsReady(true)
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

    configureSDK()
  }, [])

  // Request camera permission
  useEffect(() => {
    PassioSDK.requestCameraAuthorization().then(cameraAuthorized => {
      setCameraAuthorized(cameraAuthorized)
    })
  }, [])

  // Start Food Detection
  useEffect(() => {
    if (!isReady) return

    const config = {
      detectBarcodes: true, // Enable barcode detection
      detectPackagedFood: true, // Enable detection of packaged food
    }

    const subscription = PassioSDK.startFoodDetection(
      config,
      async detection => {
        const { candidates } = detection

        if (candidates?.barcodeCandidates?.length) {
          console.log('Barcode Candidates:', candidates.barcodeCandidates)
          // Handle barcode detection results
        } else if (candidates?.packagedFoodCode?.length) {
          console.log('Packaged Food Detected:', candidates.packagedFoodCode)
          // Handle packaged food detection results
        } else if (candidates?.detectedCandidates?.length) {
          console.log(
            'Visually Recognized Food:',
            candidates.detectedCandidates
          )
          // Handle visual recognition results
        }
      }
    )

    // Stop food detection when component unmounts
    return () => subscription.remove()
  }, [isReady])

  return (
    <View style={styles.container}>
      {loadingState === 'ready' && isCameraAuthorized ? (
        <DetectionCameraView style={styles.cameraView} />
      ) : (
        <View style={styles.messageContainer}>
          {loadingState === 'error' && (
            <Text style={styles.errorText}>Error configuring Passio SDK</Text>
          )}
          {!isCameraAuthorized && (
            <Text style={styles.infoText}>
              Camera permission is required to use this feature.
            </Text>
          )}
          {loadingState === 'notReady' && (
            <Text style={styles.infoText}>
              SDK is not ready. Please wait...
            </Text>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cameraView: {
    flex: 1,
    width: '100%',
  },
  messageContainer: {
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
  },
})

export default FoodDetectionApp
