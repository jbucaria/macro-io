import React from 'react'
import { View } from 'react-native'
import { useThemeColor } from '../hooks/useThemeColor'

export function ThemedView({
  style,
  className,
  lightColor,
  darkColor,
  ...otherProps
}) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  )

  return (
    <View
      style={[{ backgroundColor }, style]}
      className={className}
      {...otherProps}
    />
  )
}
