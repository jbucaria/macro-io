import React from 'react'
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
} from 'react-native'
import {
  PassioIconView,
  IconSize,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v3'
import useRecognizeRemote from '@/src/components/launchscreen/useRecognizeRemote'

// RecognizeImageRemote component
const RecognizeImageRemote = ({ onClose, onFoodDetail }) => {
  // Get styles object from the searchStyle function
  const styles = searchStyle()

  // Destructure values from the custom hook
  const { loading, passioSpeechRecognitionModel, onScanImage } =
    useRecognizeRemote()

  // Function to render each item in the FlatList
  const renderSearchItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={async () => {
          if (item.foodDataInfo) {
            const dataInfo = await PassioSDK.fetchFoodItemForDataInfo(
              item.foodDataInfo
            )
            if (dataInfo) {
              onFoodDetail(dataInfo)
            }
          }
        }}
      >
        <View style={styles.itemIconContainer}>
          <PassioIconView
            style={styles.itemIcon}
            config={{
              passioID: item.foodDataInfo?.iconID ?? '',
              iconSize: IconSize.PX360,
            }}
          />
        </View>
        <View>
          <Text style={styles.itemFoodName}>{item.recognisedName}</Text>
          <Text style={styles.itemFoodName}>
            {item.portionSize + ' |  ' + item.weightGrams}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  // Display loading indicator when results are empty and loading is true
  const renderLoading = () => {
    return <>{loading ? <ActivityIndicator /> : null}</>
  }

  // Render the component
  return (
    <SafeAreaView style={styles.body}>
      <View style={styles.closeButton}>
        <TouchableOpacity onPress={onClose}>
          <Image
            style={styles.closeText}
            source={require('@/assets/images/back.png')}
          />
        </TouchableOpacity>
      </View>
      {/* Search input */}
      <TouchableOpacity onPress={onScanImage} style={styles.textInput}>
        <Text style={{ color: 'white' }}>Pick Image</Text>
      </TouchableOpacity>

      <FlatList
        data={passioSpeechRecognitionModel}
        contentContainerStyle={styles.list}
        renderItem={renderSearchItem}
        ListEmptyComponent={renderLoading}
        keyExtractor={(item, index) => 'item.advisorInfo?.foodDataInfo' + index}
      />
    </SafeAreaView>
  )
}

// Styles for the component
const searchStyle = () =>
  StyleSheet.create({
    closeButton: {},
    list: {
      marginTop: 16,
    },
    closeText: {
      margin: 16,
      height: 24,
      width: 24,
    },
    itemContainer: {
      padding: 12,
      flex: 1,
      marginVertical: 4,
      marginHorizontal: 16,
      backgroundColor: 'white',
      flexDirection: 'row',
      borderRadius: 24,
    },
    itemFoodName: {
      flex: 1,
      textTransform: 'capitalize',
      marginHorizontal: 8,
      fontSize: 16,
    },
    itemIconContainer: {
      height: 46,
      width: 46,
      borderRadius: 30,
      overflow: 'hidden',
    },
    itemIcon: {
      height: 46,
      width: 46,
    },
    textInput: {
      backgroundColor: 'blue',
      paddingHorizontal: 16,
      padding: 12,
      alignItems: 'center',
      color: 'white',
      borderRadius: 16,
      fontWeight: '500',
      fontSize: 16,
      marginHorizontal: 16,
    },
    body: {
      backgroundColor: 'rgba(242, 245, 251, 1)',
      flex: 1,
    },
  })

export default RecognizeImageRemote
