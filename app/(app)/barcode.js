import React, { useCallback, useState } from 'react'
import {
  View,
  Image,
  Text,
  Pressable,
  Modal,
  ImageBackground,
  Alert,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import {
  useCameraAuthorization,
  usePassioSDK,
} from '@/src/components/launchscreen/usePassioSDK'
import { launchImageLibrary } from 'react-native-image-picker'
import { PassioSDK } from '@passiolife/nutritionai-react-native-sdk-v3'
import FoodDetail from '@/src/components/launchscreen/foodDetail'
import ChatScreen from '@/app/(app)/advisor'
import { FoodDetectionView } from '@/src/components/launchscreen/foodDetectionView'
import FoodSearchView from '@/src/components/launchscreen/foodSearchView'
import { MultiScanView } from '@/src/components/launchscreen/multiScanView'
import QuickScanningScreen from '@/app/(app)/camera'
import NutritionFactScreen from '@/src/components/launchscreen/nutritionFactScreen'
import RecognizeImageRemote from '@/src/components/launchscreen/recognizeImageRemote'
import RecognizeTextRemote from '@/src/components/launchscreen/recognizeTextRemote'
import LegacyAPITest from '@/src/components/launchscreen/legacyAPITest'
import FoodSuggestion from '@/src/components/launchscreen/foodSuggestion'
import MealPlan from '@/src/components/launchscreen/mealPlan'

const logo = require('@/assets/images/icon.png')

export const LoadingContainerView = () => {
  const [viewType, setViewType] = useState('Home')
  const [loading, setLoading] = useState(false)
  const cameraAuthorized = useCameraAuthorization()
  const sdkStatus = usePassioSDK({
    key: '9DNuQvuKEnyROsSAe4a7BLZ3fCbptYn0nCWnZquo',
    autoUpdate: true,
  })

  const [passioFoodItem, setPassioFoodItem] = useState(null)

  // Navigation Handlers
  const setViewTo = type => useCallback(() => setViewType(type), [])

  // Image Scanning
  const onScanImage = useCallback(async () => {
    try {
      const { assets } = await launchImageLibrary({ mediaType: 'photo' })
      if (assets) {
        setLoading(true)
        PassioSDK.detectFoodFromImageURI(
          assets?.[0].uri?.replace('file://', '') || ''
        )
          .then(async candidates => {
            const max = candidates?.detectedCandidates?.reduce(
              (prev, current) =>
                prev && prev.confidence > current.confidence ? prev : current
            )

            if (max && max.passioID) {
              const result = await PassioSDK.fetchFoodItemForPassioID(
                max.passioID
              )
              setPassioFoodItem(result)
            }
          })
          .catch(() => {
            Alert.alert('Unable to recognize this image')
          })
          .finally(() => {
            setLoading(false)
          })
      }
    } catch (err) {
      setLoading(false)
    }
  }, [])

  const views = {
    Scan: (
      <FoodDetectionView
        onStopPressed={setViewTo('Home')}
        onItemPress={setPassioFoodItem}
      />
    ),
    Search: (
      <FoodSearchView
        onClose={setViewTo('Home')}
        onFoodDetail={setPassioFoodItem}
      />
    ),
    MultiScan: (
      <MultiScanView
        onClose={setViewTo('Home')}
        onFoodDetail={setPassioFoodItem}
      />
    ),
    Quick: (
      <QuickScanningScreen
        onClose={setViewTo('Home')}
        onFoodDetail={setPassioFoodItem}
      />
    ),
    Suggestion: (
      <FoodSuggestion
        onClose={setViewTo('Home')}
        onFoodDetail={setPassioFoodItem}
      />
    ),
    MealPlan: (
      <MealPlan onClose={setViewTo('Home')} onFoodDetail={setPassioFoodItem} />
    ),
    NutritionFact: <NutritionFactScreen onClose={setViewTo('Home')} />,
    recognizeImageRemote: (
      <RecognizeImageRemote
        onClose={setViewTo('Home')}
        onFoodDetail={setPassioFoodItem}
      />
    ),
    recognizeTextRemote: (
      <RecognizeTextRemote
        onClose={setViewTo('Home')}
        onFoodDetail={setPassioFoodItem}
      />
    ),
    legacyAPI: (
      <LegacyAPITest
        onClose={setViewTo('Home')}
        onFoodDetail={setPassioFoodItem}
      />
    ),
    Chat: <ChatScreen onClose={setViewTo('Home')} />,
    Home: (
      <LoadingView
        status={sdkStatus.loadingState}
        cameraAuthorized={cameraAuthorized}
        loading={loading}
        fileLeft={sdkStatus.leftFile}
        onScanImagePress={onScanImage}
        onSetView={setViewTo}
      />
    ),
  }

  return (
    <>
      {views[viewType] || views['Home']}
      <Modal visible={!!passioFoodItem}>
        {passioFoodItem && (
          <FoodDetail
            onClose={() => setPassioFoodItem(null)}
            passioFoodItem={passioFoodItem}
          />
        )}
      </Modal>
    </>
  )
}

const FeatureButton = ({ title, onClick }) => {
  return (
    <Pressable style={styles.buttonContainer} onPress={onClick}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  )
}

const LoadingView = ({
  status,
  cameraAuthorized,
  loading,
  fileLeft,
  onScanImagePress,
  onSetView,
}) => {
  return (
    <ImageBackground
      source={require('@/assets/images/splash-icon.png')}
      style={styles.container}
    >
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      <ScrollView style={{ width: '100%', paddingHorizontal: 16 }}>
        <View style={styles.actions}>
          {status === 'downloading' && <Text>Downloading models...</Text>}
          {status === 'error' && <Text>Error!</Text>}
          {fileLeft !== null && fileLeft !== 0 && (
            <Text>Downloading file left... {fileLeft}</Text>
          )}
          {status === 'ready' && (
            <>
              <FeatureButton
                title="Text Search"
                onClick={onSetView('Search')}
              />
              {cameraAuthorized && (
                <>
                  <FeatureButton
                    title="Food Scanner"
                    onClick={onSetView('Scan')}
                  />
                  <FeatureButton
                    title="Quick Scan"
                    onClick={onSetView('Quick')}
                  />
                  <FeatureButton
                    title={loading ? 'Please wait, Loading...' : 'Pick Image'}
                    onClick={onScanImagePress}
                  />
                  <FeatureButton title="Chat" onClick={onSetView('Chat')} />
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(79, 70, 229, 1)',
  },
  logo: {
    height: 150,
    width: 300,
    alignSelf: 'center',
    marginVertical: 32,
  },
  actions: {
    flex: 1,
  },
  buttonContainer: {
    padding: 16,
    flexDirection: 'row',
    borderRadius: 12,
    marginHorizontal: 16,
    borderColor: 'blue',
    backgroundColor: 'rgba(0, 0, 0, 0.50)',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0.1 },
    shadowOpacity: 0.5,
    shadowRadius: 0.5,
    marginVertical: 6,
  },
  buttonText: {
    flex: 1,
    color: 'white',
    fontWeight: '600',
  },
})

export default LoadingContainerView
