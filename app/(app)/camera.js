import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { DetectionCameraView } from '@passiolife/nutritionai-react-native-sdk-v3'
import { useQuickScan } from '@/src/hooks/useQuickScan'
import { QuickFoodResult } from '@/src/components/QuickFoodResult'
import {
  configurePassioSDK,
  requestCameraAuthorization,
  startFoodDetection,
} from '@/src/utils/passioSdk'

const QuickScanningScreen = ({ onClose, onFoodDetail }) => {
  const {
    loading,
    passioFoodItem,
    onClearResultPress,
    alternative,
    onAlternativeFoodItemChange,
  } = useQuickScan()

  const [loadingState, setLoadingState] = useState('')
  const [isCameraAuthorized, setCameraAuthorized] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    async function initializeSDK() {
      try {
        const status = await configurePassioSDK()
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
        setLoadingState('error')
      }
    }

    initializeSDK()
  }, [])

  useEffect(() => {
    requestCameraAuthorization().then(isAuthorized => {
      setCameraAuthorized(isAuthorized)
    })
  }, [])

  useEffect(() => {
    if (!isReady) return

    const config = {
      detectBarcodes: true,
      detectPackagedFood: true,
    }

    const subscription = startFoodDetection(config, detection => {
      const { candidates } = detection

      if (candidates?.barcodeCandidates?.length) {
        console.log('Barcode Candidates:', candidates.barcodeCandidates)
      } else if (candidates?.packagedFoodCode?.length) {
        console.log('Packaged Food Detected:', candidates.packagedFoodCode)
      } else if (candidates?.detectedCandidates?.length) {
        console.log('Visually Recognized Food:', candidates.detectedCandidates)
      }
    })

    return () => subscription.remove()
  }, [isReady])

  const styles = quickScanStyle()

  return (
    <View style={styles.blackBackgroundStyle}>
      {isCameraAuthorized ? (
        <DetectionCameraView style={styles.detectionCamera} />
      ) : (
        <View style={styles.loadingIndicator}>
          <Text>Camera authorization is required</Text>
        </View>
      )}
      {loading && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator />
          <Text>Scanning...</Text>
        </View>
      )}
      {passioFoodItem && (
        <QuickFoodResult
          attribute={passioFoodItem}
          onAlternativeFoodItemChange={onAlternativeFoodItemChange}
          onClearResultPress={onClearResultPress}
          alternativeAttributes={alternative || []}
          onItemClick={onFoodDetail}
        />
      )}
      <View style={styles.closeButton}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.text}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const quickScanStyle = () =>
  StyleSheet.create({
    detectionCamera: {
      flex: 1,
      width: '100%',
    },
    blackBackgroundStyle: {
      backgroundColor: 'black',
      width: '100%',
      flex: 1,
      flexDirection: 'column',
    },
    loadingIndicator: {
      backgroundColor: 'white',
      minHeight: 150,
      borderTopRightRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      borderTopLeftRadius: 24,
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
    },
    text: {
      color: 'white',
      fontSize: 30,
    },
    closeButton: {
      position: 'absolute',
      top: 45,
      right: 25,
      zIndex: 1000,
      color: 'white',
    },
  })

export default QuickScanningScreen
