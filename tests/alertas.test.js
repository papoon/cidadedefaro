import { describe, it, expect } from 'vitest'
import { isExpired } from '../src/data/alertas.js'

const NOW = Date.parse('2026-11-21T12:00:00Z')

describe('isExpired', () => {
  it('alerta sem data nunca expira', () => {
    expect(isExpired({}, NOW)).toBe(false)
  })
  it('data inválida não expira (não esconder alertas por erro de digitação)', () => {
    expect(isExpired({ expires: 'amanhã' }, NOW)).toBe(false)
  })
  it('data passada expira, data futura não', () => {
    expect(isExpired({ expires: '2026-11-20T00:00:00Z' }, NOW)).toBe(true)
    expect(isExpired({ expires: '2026-12-01T00:00:00Z' }, NOW)).toBe(false)
  })
})
