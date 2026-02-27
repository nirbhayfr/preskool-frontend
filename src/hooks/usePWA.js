import { useEffect, useState } from 'react'

export function useIsPWA() {
  const [isPWA, setIsPWA] = useState(false)

  useEffect(() => {
    const checkIfPWA = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches

      const isIOSStandalone =
        typeof window.navigator.standalone !== 'undefined' &&
        window.navigator.standalone === true

      setIsPWA(isStandalone || isIOSStandalone)
    }

    checkIfPWA()

    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    mediaQuery.addEventListener('change', checkIfPWA)

    return () => {
      mediaQuery.removeEventListener('change', checkIfPWA)
    }
  }, [])

  return isPWA
}
