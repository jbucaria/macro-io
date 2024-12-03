// FILE: /app/components/PassioConfigurationView.js

import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { configureSDK } from '@/src/config/nutritionSdkConfig'
import { useDownloadProgress } from '@/src/hooks/useDownloadProgress.js'

export const PassioConfigurationView = () => {
  const [sdkStatus, setSDKStatus] = useState('init')
  const leftFile = useDownloadProgress()

  useEffect(() => {
    async function configure() {
      try {
        const status = await configureSDK()
        switch (status.mode) {
          case 'notReady':
            return
          case 'isReadyForDetection':
            setSDKStatus('ready')
            return
          case 'error':
            console.error(`PassioSDK Error ${status.errorMessage}`)
            setSDKStatus('error')
            return
        }
      } catch (err) {
        console.error(`PassioSDK Error ${err}`)
        setSDKStatus('error')
      }
    }
    configure()
  }, [])

  return (
    <View style={styles.container}>
      {(() => {
        switch (sdkStatus) {
          case 'ready':
            return (
              <View style={styles.middle}>
                <Text>SDK is Ready</Text>
              </View>
            )

          case 'error':
            return (
              <View style={styles.middle}>
                <Text>SDK is Error</Text>
              </View>
            )

          default:
            return (
              <View style={styles.middle}>
                <ActivityIndicator size={20} color={'white'} />
                {leftFile !== null && (
                  <Text>{`Downloading file left ${leftFile}`}</Text>
                )}
              </View>
            )
        }
      })()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(79, 70, 229, 1)',
  },
  middle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
})
