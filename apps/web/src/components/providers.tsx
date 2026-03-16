'use client'

import { LazyMotion, domAnimation } from 'framer-motion'

/**
 * Global client providers.
 *
 * LazyMotion with domAnimation:
 *  - Tree-shakes the full motion feature set into a smaller async chunk.
 *  - Prevents framer-motion from injecting SSR inline styles that React 19's
 *    strict hydration checks can flag as mismatches.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>
}
