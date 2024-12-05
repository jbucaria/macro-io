import React from 'react'
import { View, Text, Button, ActivityIndicator } from 'react-native'
import { useQuickNutritionScan } from './useQuickNutritionScan'

const NutritionScannerComponent = () => {
  const { loading, nutritionFacts, onClearResultPress } =
    useQuickNutritionScan()

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : nutritionFacts ? (
        <View>
          <Text>Calories: {nutritionFacts.calories}</Text>
          <Text>Carbs: {nutritionFacts.carbs}</Text>
          <Text>Protein: {nutritionFacts.protein}</Text>
          <Text>Fat: {nutritionFacts.fat}</Text>
          <Button title="Clear" onPress={onClearResultPress} />
        </View>
      ) : (
        <Text>No nutrition facts detected</Text>
      )}
    </View>
  )
}

export default NutritionScannerComponent
