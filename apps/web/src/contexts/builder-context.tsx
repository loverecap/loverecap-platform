'use client'

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { toast } from 'sonner'

export type BuilderStep = 'info' | 'timeline' | 'photos' | 'message' | 'music' | 'review'

export const BUILDER_STEPS: BuilderStep[] = ['info', 'timeline', 'photos', 'message', 'music', 'review']

export const STEP_LABELS: Record<BuilderStep, string> = {
  info: 'Sobre vocês',
  timeline: 'Linha do tempo',
  photos: 'Galeria',
  message: 'Mensagem',
  music: 'Música',
  review: 'Revisão',
}

export const STEP_URLS: Record<BuilderStep, string> = {
  info: '/create/info',
  timeline: '/create/timeline',
  photos: '/create/photos',
  message: '/create/message',
  music: '/create/music',
  review: '/create/review',
}

export interface BuilderMemory {
  id: string
  title: string
  short_description?: string
  description?: string
  occurred_at?: string
  emoji?: string
  photoPreviewUrl?: string
  assetId?: string
}

export interface UploadedPhoto {
  assetId: string
  storagePath: string
  
  previewUrl: string
  name: string
}

type Memory = BuilderMemory

interface BuilderState {
  projectId: string | null
  currentStep: BuilderStep
  info: {
    title: string
    partner_name_1: string
    partner_name_2: string
    relationship_start_date: string
    theme_id?: string
  } | null
  memories: Memory[]
  uploadedPhotos: UploadedPhoto[]
  finalMessage: string
  isLoading: boolean
  error: string | null
}

type BuilderAction =
  | { type: 'SET_PROJECT_ID'; payload: string }
  | { type: 'SET_STEP'; payload: BuilderStep }
  | { type: 'SET_INFO'; payload: BuilderState['info'] }
  | { type: 'ADD_MEMORY'; payload: Memory }
  | { type: 'REMOVE_MEMORY'; payload: string }
  | { type: 'SET_MEMORIES'; payload: Memory[] }
  | { type: 'ADD_UPLOADED_PHOTO'; payload: UploadedPhoto }
  | { type: 'SET_UPLOADED_PHOTOS'; payload: UploadedPhoto[] }
  | { type: 'SET_FINAL_MESSAGE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'HYDRATE'; payload: Partial<BuilderState> }
  | { type: 'RESET' }

const initialState: BuilderState = {
  projectId: null,
  currentStep: 'info',
  info: null,
  memories: [],
  uploadedPhotos: [],
  finalMessage: '',
  isLoading: false,
  error: null,
}

type PersistedState = Pick<BuilderState, 'projectId' | 'info' | 'memories' | 'uploadedPhotos' | 'finalMessage'>

const STORAGE_KEY = 'loverecap:builder'

function readPersistedState(): Partial<PersistedState> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Partial<PersistedState>
  } catch {
    return {}
  }
}

function writePersistedState(state: BuilderState) {
  if (typeof window === 'undefined') return
  try {
    const persisted: PersistedState = {
      projectId: state.projectId,
      info: state.info,
      memories: state.memories,
      uploadedPhotos: state.uploadedPhotos.map(({ previewUrl: _, ...rest }) => ({
        ...rest,
        previewUrl: '',
      })),
      finalMessage: state.finalMessage,
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
  } catch {
  }
}

function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case 'SET_PROJECT_ID':
      return { ...state, projectId: action.payload }
    case 'SET_STEP':
      return { ...state, currentStep: action.payload }
    case 'SET_INFO':
      return { ...state, info: action.payload }
    case 'ADD_MEMORY':
      return { ...state, memories: [...state.memories, action.payload] }
    case 'REMOVE_MEMORY':
      return { ...state, memories: state.memories.filter((m) => m.id !== action.payload) }
    case 'SET_MEMORIES':
      return { ...state, memories: action.payload }
    case 'ADD_UPLOADED_PHOTO':
      return { ...state, uploadedPhotos: [...state.uploadedPhotos, action.payload] }
    case 'SET_UPLOADED_PHOTOS':
      return { ...state, uploadedPhotos: action.payload }
    case 'SET_FINAL_MESSAGE':
      return { ...state, finalMessage: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'HYDRATE':
      return { ...state, ...action.payload }
    case 'RESET':
      if (typeof window !== 'undefined') {
        try { sessionStorage.removeItem(STORAGE_KEY) } catch {  }
      }
      return { ...initialState }
    default:
      return state
  }
}

interface BuilderContextValue {
  state: BuilderState
  dispatch: React.Dispatch<BuilderAction>
  goToStep: (step: BuilderStep) => void
  goToNextStep: () => void
  goToPrevStep: () => void
}

const BuilderContext = createContext<BuilderContextValue | null>(null)

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(builderReducer, initialState)

  useEffect(() => {
    const saved = readPersistedState()
    const hasSession = !!(saved.projectId ?? saved.info ?? saved.memories?.length ?? saved.uploadedPhotos?.length)

    if (hasSession) {
      dispatch({ type: 'HYDRATE', payload: saved })
      return
    }

    // sessionStorage empty — try to recover from DB
    void (async () => {
      try {
        const res = await fetch('/api/projects/draft')
        if (!res.ok) return
        const json = await res.json() as { data?: { project: Record<string, unknown>; memories: Record<string, unknown>[] } | null }
        const data = json.data
        if (!data?.project) return

        const p = data.project
        dispatch({
          type: 'HYDRATE',
          payload: {
            projectId: p['id'] as string,
            info: {
              title: (p['title'] as string) ?? '',
              partner_name_1: (p['partner_name_1'] as string) ?? '',
              partner_name_2: (p['partner_name_2'] as string) ?? '',
              relationship_start_date: (p['relationship_start_date'] as string) ?? '',
              ...(p['theme_id'] ? { theme_id: p['theme_id'] as string } : {}),
            },
            memories: (data.memories ?? []).map((m) => ({
              id: m['id'] as string,
              title: (m['title'] as string) ?? '',
              short_description: m['short_description'] as string | undefined,
              description: m['description'] as string | undefined,
              occurred_at: m['occurred_at'] as string | undefined,
              emoji: m['emoji'] as string | undefined,
            })),
          },
        })

        toast.info('Recuperamos seu rascunho anterior ✨', {
          description: 'Continue de onde parou.',
          duration: 5000,
        })
      } catch {
        // Recovery failed silently — user starts fresh, no error shown
      }
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    writePersistedState(state)
  }, [state])

  const goToStep = useCallback((step: BuilderStep) => {
    dispatch({ type: 'SET_STEP', payload: step })
  }, [])

  const goToNextStep = useCallback(() => {
    const currentIndex = BUILDER_STEPS.indexOf(state.currentStep)
    if (currentIndex < BUILDER_STEPS.length - 1) {
      const nextStep = BUILDER_STEPS[currentIndex + 1]
      if (nextStep) dispatch({ type: 'SET_STEP', payload: nextStep })
    }
  }, [state.currentStep])

  const goToPrevStep = useCallback(() => {
    const currentIndex = BUILDER_STEPS.indexOf(state.currentStep)
    if (currentIndex > 0) {
      const prevStep = BUILDER_STEPS[currentIndex - 1]
      if (prevStep) dispatch({ type: 'SET_STEP', payload: prevStep })
    }
  }, [state.currentStep])

  return (
    <BuilderContext.Provider value={{ state, dispatch, goToStep, goToNextStep, goToPrevStep }}>
      {children}
    </BuilderContext.Provider>
  )
}

export function useBuilder() {
  const ctx = useContext(BuilderContext)
  if (!ctx) throw new Error('useBuilder must be used inside BuilderProvider')
  return ctx
}
