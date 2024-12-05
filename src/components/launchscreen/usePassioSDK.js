import { useEffect, useState } from 'react'

import {
  PassioSDK,
  PassioTokenBudget,
} from '@passiolife/nutritionai-react-native-sdk-v3'

export const usePassioSDK = ({
  key,
  debugMode = false,
  autoUpdate = false,
}) => {
  const [loadingState, setLoadingState] = useState('init')
  const [leftFile, setDownloadingLeft] = useState(null)

  useEffect(() => {
    async function configure() {
      try {
        const status = await PassioSDK.configure({
          key: '9DNuQvuKEnyROsSAe4a7BLZ3fCbptYn0nCWnZquo',
          debugMode: debugMode,
          autoUpdate: autoUpdate,
        })
        switch (status.mode) {
          case 'notReady':
            return
          case 'isReadyForDetection':
            setLoadingState('ready')
            PassioSDK.setAccountListener({
              onTokenBudgetUpdate: tokenBudget => {
                console.log('tokenBudget', tokenBudget)
              },
            })
            return
          case 'error':
            console.error(`PassioSDK Error ${status.errorMessage}`)
            setLoadingState('error')
            return
        }
      } catch (err) {
        console.error(`PassioSDK Error ${err}`)
        setLoadingState('error')
      }
    }
    configure()
  }, [key, debugMode, autoUpdate])

  useEffect(() => {
    const callBacks = PassioSDK.onDownloadingPassioModelCallBacks({
      completedDownloadingFile: ({ filesLeft }) => {
        setDownloadingLeft(filesLeft)
      },
      downloadingError: ({ message }) => {
        console.log('DownloadingError ===>', message)
      },
    })
    return () => callBacks.remove()
  }, [])

  return {
    loadingState,
    leftFile,
  }
}

export const useCameraAuthorization = () => {
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    async function getAuth() {
      const isAuthorized = await PassioSDK.requestCameraAuthorization()
      setAuthorized(isAuthorized)
    }
    getAuth()
  }, [])

  return authorized
}
