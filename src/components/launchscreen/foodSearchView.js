import React from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  View,
} from 'react-native'
import {
  PassioIconView,
  IconSize,
} from '@passiolife/nutritionai-react-native-sdk-v3'
import useFoodSearch from '@/src/components/launchscreen/useFoodSearch'

const FoodSearchView = ({ onClose, onFoodDetail }) => {
  const styles = searchStyle()

  const {
    searchQuery,
    onSearchFood,
    foodResults,
    loading,
    alternatives,
    onSearchResultItemPress,
  } = useFoodSearch({ onClose, onFoodDetail })

  const renderSearchItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onSearchResultItemPress(item)}
      >
        <View style={styles.itemIconContainer}>
          <PassioIconView
            style={styles.itemIcon}
            config={{
              passioID: item.iconID,
              iconSize: IconSize.PX360,
            }}
          />
        </View>
        <View>
          <Text style={styles.itemFoodName}>{item.foodName}</Text>
          <Text style={styles.itemBrandName}>
            {'calories ' +
              Math.round(item.nutritionPreview?.calories ?? 0) +
              ' kcal | '}
            <Text style={styles.itemBrandName}>
              {'fat ' + Math.round(item.nutritionPreview?.fat ?? 0)}
            </Text>
            <Text style={styles.itemBrandName}>
              {' | protein ' + Math.round(item.nutritionPreview?.protein ?? 0)}
            </Text>
          </Text>

          <Text style={styles.itemBrandName}>
            {'carbs ' + Math.round(item.nutritionPreview?.carbs ?? 0)}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderAlternativeItem = ({ item }) => {
    return (
      <Pressable
        style={styles.alternativeContainer}
        onPress={() => onSearchFood(item)}
      >
        <Text style={styles.itemAlternativeName}>{item}</Text>
      </Pressable>
    )
  }

  const renderLoading = () => {
    return <>{loading ? <ActivityIndicator /> : null}</>
  }

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
      <TextInput
        value={searchQuery}
        style={styles.textInput}
        placeholder={'Type in food name'}
        placeholderTextColor={'gray'}
        onChangeText={onSearchFood}
      />

      <FlatList
        data={foodResults}
        contentContainerStyle={styles.list}
        renderItem={renderSearchItem}
        ListEmptyComponent={renderLoading}
        ListHeaderComponent={() => (
          <FlatList
            data={alternatives}
            contentContainerStyle={styles.itemAlternativeContainer}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderAlternativeItem}
            keyExtractor={(item, index) => item.toString() + index}
          />
        )}
        keyExtractor={(item, index) => item.iconID.toString() + index}
      />
    </SafeAreaView>
  )
}

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
    itemBrandName: {
      flex: 1,
      textTransform: 'capitalize',
      marginHorizontal: 8,
      fontSize: 12,
    },
    itemAlternativeContainer: {
      overflow: 'hidden',
    },
    alternativeContainer: {
      marginStart: 16,
      alignItems: 'center',
      overflow: 'hidden',
      alignSelf: 'center',
      backgroundColor: 'rgba(238, 242, 255, 1)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0.1 },
      shadowOpacity: 0.5,
      shadowRadius: 0.5,
      marginVertical: 2,
      marginBottom: 14,
      elevation: 5,
      borderRadius: 24,
    },
    itemAlternativeName: {
      textTransform: 'capitalize',
      paddingVertical: 8,
      paddingHorizontal: 16,
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

export default FoodSearchView
