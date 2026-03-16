import { useEffect, useState } from 'react'

/**
 * Returns `false` during SSR and the first render (hydration), `true` after mount.
 * Use this to gate any rendering that must differ between server and client,
 * preventing React hydration mismatches.
 */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted
}
