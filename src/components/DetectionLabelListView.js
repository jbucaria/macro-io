import React from 'react'
import {
  PassioIconView,
  IconSize,
  PassioFoodItem, // Import PassioFoodItem
} from '@passiolife/nutritionai-react-native-sdk-v3'
import { Pressable, StyleSheet, Text, View } from 'react-native'

/**
 * DetectionLabelListView
 * @param {Array<PassioFoodItem>} candidates - Array of food candidates (PassioFoodItem).
 * @param {Function} onItemPress - Callback when a candidate is pressed.
 */
const DetectionLabelListView = ({ candidates, onItemPress }) => {
  return (
    <View style={styles.container}>
      {candidates.map((candidate, i) => (
        <CandidateView item={candidate} onItemPress={onItemPress} key={i} />
      ))}
    </View>
  )
}

/**
 * CandidateView
 * @param {PassioFoodItem} item - A single candidate (PassioFoodItem).
 * @param {Function} onItemPress - Callback when the candidate is pressed.
 */
const CandidateView = ({ item, onItemPress }) => {
  const { name, details, iconId } = item

  return (
    <Pressable
      onPress={() => {
        onItemPress(item)
      }}
      style={styles.candidate}
    >
      <View style={styles.row}>
        {iconId && (
          <PassioIconView
            style={styles.icon}
            config={{
              passioID: iconId,
              iconSize: IconSize.PX90,
            }}
          />
        )}
        <View>
          <Text style={styles.item}>{name}</Text>
          {details && <Text style={styles.ingredients}>{details}</Text>}
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  candidate: {
    backgroundColor: 'rgba(238, 242, 255, 1)',
    padding: 6,
    marginHorizontal: 12,
    marginVertical: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  item: {
    fontSize: 20,
    fontWeight: '400',
    padding: 6,
    textTransform: 'capitalize',
    color: 'black',
  },
  icon: {
    width: 50,
    height: 50,
    overflow: 'hidden',
    borderRadius: 25,
  },
  ingredients: {
    opacity: 0.8,
    marginVertical: 6,
    color: 'black',
  },
})

export default DetectionLabelListView
