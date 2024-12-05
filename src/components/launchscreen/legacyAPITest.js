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
  TextInput,
} from 'react-native'
import {
  PassioIconView,
  IconSize,
} from '@passiolife/nutritionai-react-native-sdk-v3'
import useLegacyAPITest from '@/src/components/launchscreen/useLegacyAPITest'

const LegacyAPITest = props => {
  // Get styles object from the componentStyle function
  const styles = componentStyle()

  // Destructure values from the custom hook
  const { loading, passioFoodItem, searchQuery, onSpeechRecognition } =
    useLegacyAPITest(props)

  // Function to render each item in the FlatList
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={async () => {
          props.onFoodDetail(item)
        }}
      >
        <View style={styles.itemIconContainer}>
          <PassioIconView
            style={styles.itemIcon}
            config={{
              passioID: item.iconId ?? '',
              iconSize: IconSize.PX360,
            }}
          />
        </View>
        <View>
          <Text style={styles.itemFoodName}>{item.name}</Text>
          <Text style={styles.itemFoodName}>
            {item.amount?.selectedQuantity + ' |  ' + item.amount.selectedUnit}
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
        <TouchableOpacity onPress={props.onClose}>
          <Image
            style={styles.closeText}
            source={require('@/assets/images/back.png')}
          />
        </TouchableOpacity>
      </View>
      <TextInput
        value={searchQuery}
        style={styles.textInput}
        placeholder={'Enter passio ID'}
        placeholderTextColor={'gray'}
        onChangeText={onSpeechRecognition}
      />

      <FlatList
        data={passioFoodItem}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        ListEmptyComponent={renderLoading}
        keyExtractor={(item, index) => 'item_' + index}
      />
    </SafeAreaView>
  )
}

// Styles for the component
const componentStyle = () =>
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
      backgroundColor: 'white',
      paddingHorizontal: 16,
      padding: 12,
      color: 'black',
      fontWeight: '500',
      fontSize: 16,
      marginHorizontal: 16,
    },
    body: {
      backgroundColor: 'rgba(242, 245, 251, 1)',
      flex: 1,
    },
  })

export default LegacyAPITest
