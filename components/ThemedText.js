import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native'
import { useThemeColor } from '../hooks/useThemeColor'

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')

  let className = ''
  switch (type) {
    case 'default':
      className = 'text-base leading-6'
      break
    case 'defaultSemiBold':
      className = 'text-base leading-6 font-semibold'
      break
    case 'title':
      className = 'text-2xl leading-8 font-bold'
      break
    case 'subtitle':
      className = 'text-xl font-bold'
      break
    case 'link':
      className = 'text-base leading-7 text-[#0a7ea4]'
      break
    default:
      break
  }

  return <Text style={[{ color }, style]} className={className} {...rest} />
}
