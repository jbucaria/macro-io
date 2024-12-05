import {
  BarcodeCandidate,
  DetectedCandidate,
  DetectionCameraView,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v3'

import { DetectionLabelListView } from '@/src/components/launchscreen/detectionLabelList'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const attributeLogging = false

export const FoodDetectionView = props => {
  const [state, setState] = useState({ candidates: [] })

  useEffect(() => {
    const config = {
      detectBarcodes: true,
      detectPackagedFood: true,
    }
    const subscription = PassioSDK.startFoodDetection(
      config,
      async detection => {
        const { candidates } = detection
        if (candidates && candidates?.barcodeCandidates?.length) {
          const attributes = await getAttributesForBarcodeCandidates(
            candidates.barcodeCandidates
          )
          setState({ candidates: attributes })
        } else if (candidates && candidates?.packagedFoodCode?.length) {
          const attributes = await getAttributesForPackagedFoodCandidates(
            candidates.packagedFoodCode
          )
          setState({ candidates: attributes })
        } else if (candidates?.detectedCandidates?.length) {
          const attributes = await getAttributesFromVisualCandidates(
            candidates.detectedCandidates
          )
          setState({ candidates: attributes })
        } else {
          setState({ candidates: [] })
        }
      }
    )
    return () => subscription.remove()
  }, [])

  return (
    <View style={styles.container}>
      <DetectionCameraView style={styles.camera} />
      <View style={styles.labelOverlay}>
        <DetectionLabelListView
          candidates={state.candidates}
          onItemPress={props.onItemPress}
        />
      </View>
      <View style={styles.closeButton}>
        <TouchableOpacity onPress={props.onStopPressed}>
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

async function getAttributesFromVisualCandidates(candidates) {
  const getAttributes = candidates.map(({ passioID }) => {
    return PassioSDK.fetchFoodItemForPassioID(passioID).then(attr => {
      attributeLogging &&
        console.log(
          'Got visual candidate attributes ',
          JSON.stringify(attr, null, 2)
        )
      return attr
    })
  })
  const attrs = await Promise.all(getAttributes)
  return attrs.filter(notEmpty)
}

async function getAttributesForBarcodeCandidates(candidates) {
  const getAttributes = candidates.map(({ barcode }) => {
    return PassioSDK.fetchFoodItemForProductCode(barcode).then(attr => {
      attributeLogging &&
        console.log('Got barcode attributes ', JSON.stringify(attr, null, 2))
      return attr
    })
  })
  const attrs = await Promise.all(getAttributes)
  return attrs.filter(notEmpty)
}

async function getAttributesForPackagedFoodCandidates(candidates) {
  const getAttributes = candidates.map(packagedFoodCode => {
    return PassioSDK.fetchFoodItemForProductCode(packagedFoodCode).then(
      attr => {
        attributeLogging &&
          console.log('Got OCR attributes ', JSON.stringify(attr, null, 2))
        return attr
      }
    )
  })
  const attrs = await Promise.all(getAttributes)
  return attrs.filter(notEmpty)
}

function notEmpty(value) {
  return value !== null && value !== undefined
}
