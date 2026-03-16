import { BuilderProvider } from '@/contexts/builder-context'

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return <BuilderProvider>{children}</BuilderProvider>
}
