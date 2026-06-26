import { useEffect, useState } from 'react'

/**
 * Returns a debounced version of the input value.
 * The returned value only updates after `delay` ms of inactivity.
 */
export function useDebounce<T>(value: T, delay = 150): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}