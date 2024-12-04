// FILE: /app/hooks/useCameraAuthorization.js

import { useEffect, useState } from 'react'
import NutritionAI from '@/src/config/nutritionSdkConfig'

export const useCameraAuthorization = () => {
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    async function getAuth() {
      const isAuthorized = await NutritionAI.requestCameraAuthorization()
      setAuthorized(isAuthorized)
    }
    getAuth()
  }, [])

  return authorized
}
