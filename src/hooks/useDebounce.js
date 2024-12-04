import { useState, useEffect } from 'react'

export function useDebounce(value, delay) {
  // State and setter for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup timeout if value or delay changes, or on unmount
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay]) // Re-run effect only if value or delay changes

  return debouncedValue
}
