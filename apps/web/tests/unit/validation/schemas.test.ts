import { describe, it, expect } from 'vitest'
import { createProjectSchema, updateProjectSchema } from '@loverecap/validation'
import { createMemorySchema } from '@loverecap/validation'

describe('createProjectSchema', () => {
  const valid = {
    title: 'Nossa história',
    partner_name_1: 'Ana',
    partner_name_2: 'Pedro',
    relationship_start_date: '2019-06-12',
  }

  it('accepts valid input', () => {
    expect(createProjectSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects empty title', () => {
    const result = createProjectSchema.safeParse({ ...valid, title: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid date format', () => {
    const result = createProjectSchema.safeParse({ ...valid, relationship_start_date: '12/06/2019' })
    expect(result.success).toBe(false)
  })

  it('rejects missing partner names', () => {
    const result = createProjectSchema.safeParse({ ...valid, partner_name_1: '' })
    expect(result.success).toBe(false)
  })

  it('accepts optional theme_id as UUID', () => {
    const result = createProjectSchema.safeParse({ ...valid, theme_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
    expect(result.success).toBe(true)
  })

  it('rejects non-UUID theme_id', () => {
    const result = createProjectSchema.safeParse({ ...valid, theme_id: 'not-a-uuid' })
    expect(result.success).toBe(false)
  })

  it('rejects partner name over 60 chars', () => {
    const result = createProjectSchema.safeParse({ ...valid, partner_name_1: 'A'.repeat(61) })
    expect(result.success).toBe(false)
  })
})

describe('createMemorySchema', () => {
  const validMemory = {
    project_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    title: 'Primeiro encontro',
  }

  it('accepts minimal valid memory', () => {
    expect(createMemorySchema.safeParse(validMemory).success).toBe(true)
  })

  it('accepts full memory with all optional fields', () => {
    const result = createMemorySchema.safeParse({
      ...validMemory,
      short_description: 'Nos conhecemos numa festa',
      description: 'Foi mágico...',
      occurred_at: '2019-06-12',
      emoji: '❤️',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid project_id (not UUID)', () => {
    const result = createMemorySchema.safeParse({ ...validMemory, project_id: 'not-uuid' })
    expect(result.success).toBe(false)
  })

  it('rejects empty title', () => {
    const result = createMemorySchema.safeParse({ ...validMemory, title: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid occurred_at date', () => {
    const result = createMemorySchema.safeParse({ ...validMemory, occurred_at: '12/06/2019' })
    expect(result.success).toBe(false)
  })

  it('rejects description over 1000 chars', () => {
    const result = createMemorySchema.safeParse({ ...validMemory, description: 'x'.repeat(1001) })
    expect(result.success).toBe(false)
  })
})

describe('updateProjectSchema', () => {
  it('accepts partial updates', () => {
    const result = updateProjectSchema.safeParse({
      project_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      title: 'Novo título',
    })
    expect(result.success).toBe(true)
  })

  it('requires project_id', () => {
    const result = updateProjectSchema.safeParse({ title: 'Novo título' })
    expect(result.success).toBe(false)
  })
})
