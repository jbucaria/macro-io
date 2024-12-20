import React from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import {
  IconSize,
  PassioIconView,
} from '@passiolife/nutritionai-react-native-sdk-v3'

const AlternativeFood = React.memo(
  ({ detectedCandidates, onAlternativeFoodItemChange }) => {
    const styles = alternativeFoodStyle()

    if (detectedCandidates?.length === 0) {
      return null
    }

    return (
      <FlatList
        horizontal
        data={detectedCandidates}
        renderItem={({ item }) => {
          return (
            <Pressable
              onPress={() => onAlternativeFoodItemChange?.(item)}
              style={styles.itemContainer}
            >
              <View style={styles.itemIconContainer}>
                <PassioIconView
                  style={styles.itemIcon}
                  config={{
                    passioID: item.passioID,
                    iconSize: IconSize.PX180,
                  }}
                />
              </View>
              <Text style={styles.itemFoodName}>{item.foodName}</Text>
            </Pressable>
          )
        }}
        keyExtractor={item => item.passioID.toString()}
      />
    )
  }
)

const alternativeFoodStyle = () =>
  StyleSheet.create({
    itemContainer: {
      marginStart: 8,
      alignItems: 'center',
      backgroundColor: 'rgba(238, 242, 255, 1)',
      borderRadius: 24,
      marginVertical: 16,
      paddingVertical: 8,
      paddingHorizontal: 8,
      flexDirection: 'row',
    },
    itemFoodName: {
      marginHorizontal: 8,
      flex: 1,
      textTransform: 'capitalize',
      fontSize: 12,
    },
    itemIcon: {
      height: 24,
      width: 24,
    },
    itemIconContainer: {
      height: 24,
      width: 24,
      overflow: 'hidden',
      borderRadius: 12,
    },
  })

export default AlternativeFood
