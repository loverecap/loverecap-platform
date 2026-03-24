'use client'

import { Component, type ReactNode } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export class BuilderErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : 'Erro inesperado'
    return { hasError: true, message }
  }

  componentDidCatch(error: unknown, info: { componentStack?: string }) {
    console.error('[BuilderErrorBoundary]', error, info.componentStack)
  }

  handleRetry = () => {
    this.setState({ hasError: false, message: '' })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral-50 px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-7 w-7 text-red-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Algo deu errado
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Não se preocupe — seu progresso está salvo.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" onClick={this.handleRetry} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </Button>
          <Button asChild className="gap-2">
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4" />
              Ir para o dashboard
            </Link>
          </Button>
        </div>

        {process.env.NODE_ENV !== 'production' && this.state.message && (
          <p className="max-w-sm rounded bg-neutral-100 px-3 py-2 font-mono text-[11px] text-neutral-500">
            {this.state.message}
          </p>
        )}
      </div>
    )
  }
}
