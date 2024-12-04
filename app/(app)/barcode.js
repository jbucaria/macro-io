import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {
  DetectionCameraView,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v3'
import DetectionLabelListView from '@/src/components/DetectionLabelListView'
import { configurePassioSDK, startFoodDetection } from '@/src/utils/passioSdk'

const attributeLogging = false

export const FoodDetectionView = ({ onStopPressed, onItemPress }) => {
  const [candidates, setCandidates] = useState([])

  useEffect(() => {
    async function initializeDetection() {
      // Configure SDK
      await configurePassioSDK()

      const config = {
        detectBarcodes: true,
        detectPackagedFood: true,
      }

      const subscription = startFoodDetection(config, async detection => {
        const { candidates } = detection

        if (candidates?.barcodeCandidates?.length) {
          const attributes = await getAttributesForBarcodeCandidates(
            candidates.barcodeCandidates
          )
          setCandidates(attributes)
        } else if (candidates?.packagedFoodCode?.length) {
          const attributes = await getAttributesForPackagedFoodCandidates(
            candidates.packagedFoodCode
          )
          setCandidates(attributes)
        } else if (candidates?.detectedCandidates?.length) {
          const attributes = await getAttributesFromVisualCandidates(
            candidates.detectedCandidates
          )
          setCandidates(attributes)
        } else {
          setCandidates([])
        }
      })

      return () => subscription.remove()
    }

    initializeDetection()
  }, [])

  return (
    <View style={styles.container}>
      <DetectionCameraView style={styles.camera} />
      <View style={styles.labelOverlay}>
        <DetectionLabelListView
          candidates={candidates}
          onItemPress={onItemPress}
        />
      </View>
      <View style={styles.closeButton}>
        <TouchableOpacity onPress={onStopPressed}>
          <Text style={styles.text}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(238, 242, 255, 1)',
    width: '100%',
    flex: 1,
    flexDirection: 'column',
  },
  camera: {
    flex: 1,
  },
  text: {
    color: 'white',
    fontSize: 30,
  },
  labelOverlay: {
    position: 'absolute',
    paddingBottom: 50,
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 45,
    right: 25,
    color: 'white',
  },
})

// Utility functions
async function getAttributesFromVisualCandidates(candidates) {
  const getAttributes = candidates.map(({ passioID }) =>
    PassioSDK.fetchFoodItemForPassioID(passioID).then(attr => {
      if (attributeLogging) {
        console.log(
          'Got visual candidate attributes',
          JSON.stringify(attr, null, 2)
        )
      }
      return attr
    })
  )

  const attrs = await Promise.all(getAttributes)
  return attrs.filter(notEmpty)
}

async function getAttributesForBarcodeCandidates(candidates) {
  const getAttributes = candidates.map(({ barcode }) =>
    PassioSDK.fetchFoodItemForProductCode(barcode).then(attr => {
      if (attributeLogging) {
        console.log('Got barcode attributes', JSON.stringify(attr, null, 2))
      }
      return attr
    })
  )

  const attrs = await Promise.all(getAttributes)
  return attrs.filter(notEmpty)
}

async function getAttributesForPackagedFoodCandidates(candidates) {
  const getAttributes = candidates.map(packagedFoodCode =>
    PassioSDK.fetchFoodItemForProductCode(packagedFoodCode).then(attr => {
      if (attributeLogging) {
        console.log('Got OCR attributes', JSON.stringify(attr, null, 2))
      }
      return attr
    })
  )

  const attrs = await Promise.all(getAttributes)
  return attrs.filter(notEmpty)
}

function notEmpty(value) {
  return value !== null && value !== undefined
}

export default FoodDetectionView
