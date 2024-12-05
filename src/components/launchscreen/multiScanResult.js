import { StyleSheet } from 'react-native'
import React from 'react'
import { MultiScanResultItem } from '@/src/components/launchscreen/multiScanResultItem'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'

export const MultiScanResult = ({
  attributes,
  onClearResultPress,
  onFoodDetail,
}) => {
  const styles = multiScanResultStyle()

  const renderItem = ({ item }) => {
    return (
      <MultiScanResultItem
        attribute={item}
        onClearResultPress={onClearResultPress}
        onFoodDetail={onFoodDetail}
      />
    )
  }

  return (
    <BottomSheetFlatList
      contentContainerStyle={styles.flatList}
      data={attributes}
      renderItem={renderItem}
      keyExtractor={item => item.passioID}
      extraData={attributes}
    />
  )
}

const multiScanResultStyle = () =>
  StyleSheet.create({
    flatList: {
      marginVertical: 8,
      paddingBottom: 250,
    },
  })

export default MultiScanResult
