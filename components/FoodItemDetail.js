import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const FoodItemDetails = ({ foodItem }) => {
  if (!foodItem) return null

  const {
    displayName,
    nutritionPreview: { portion, calories, carbs, fat, protein, fiber } = {},
  } = foodItem

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{displayName}</Text>
      {portion && (
        <Text style={styles.text}>
          Portion: {portion.quantity} {portion.name} ({portion.weight.value}{' '}
          {portion.weight.unit})
        </Text>
      )}
      <Text style={styles.text}>
        Calories: {calories ? calories.toFixed(2) : 'N/A'} kcal
      </Text>
      <Text style={styles.text}>
        Carbs: {carbs ? carbs.toFixed(2) : 'N/A'} g
      </Text>
      <Text style={styles.text}>Fat: {fat ? fat.toFixed(2) : 'N/A'} g</Text>
      <Text style={styles.text}>
        Protein: {protein ? protein.toFixed(2) : 'N/A'} g
      </Text>
      <Text style={styles.text}>
        Fiber: {fiber ? fiber.toFixed(2) : 'N/A'} g
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
  },
})

export default FoodItemDetails
