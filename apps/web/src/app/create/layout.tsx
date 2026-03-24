import { BuilderProvider } from '@/contexts/builder-context'
import { BuilderErrorBoundary } from '@/components/builder/builder-error-boundary'

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return (
    <BuilderErrorBoundary>
      <BuilderProvider>{children}</BuilderProvider>
    </BuilderErrorBoundary>
  )
}
