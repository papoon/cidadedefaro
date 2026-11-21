import { describe, it, expect, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { contextoHoje, lisbonWeekday } from '../src/ui/fora-de-epoca.js'

describe('contextoHoje (hora de Lisboa)', () => {
  it('domingo à noite em UTC já pode ser segunda em Lisboa no verão', () => {
    expect(lisbonWeekday(new Date('2026-07-12T23:30:00Z'))).toBe('Mon') // 00:30 de segunda em Lisboa
    expect(contextoHoje(new Date('2026-07-12T22:30:00Z')).domingo).toBe(true)
  })
  it('fora de época de 1 nov a 30 abr', () => {
    expect(contextoHoje(new Date('2026-11-21T12:00:00Z')).foraDeEpoca).toBe(true)
    expect(contextoHoje(new Date('2026-04-30T12:00:00Z')).foraDeEpoca).toBe(true)
    expect(contextoHoje(new Date('2026-05-01T12:00:00Z')).foraDeEpoca).toBe(false)
    expect(contextoHoje(new Date('2026-10-31T12:00:00Z')).foraDeEpoca).toBe(false)
  })
})

describe('oque-fazer-hoje.html', () => {
  const html = readFileSync(resolve(process.cwd(), 'oque-fazer-hoje.html'), 'utf8')
  const section = html.match(/<section class="off-season"[\s\S]*?<\/section>/)[0]

  it('destaca os dois painéis num domingo de novembro', async () => {
    vi.useFakeTimers({ now: new Date('2026-11-22T12:00:00Z'), toFake: ['Date'] })
    document.body.innerHTML = section
    vi.resetModules()
    await import('../src/ui/fora-de-epoca.js')
    expect(document.getElementById('painel-domingo').classList.contains('is-today')).toBe(true)
    expect(document.getElementById('painel-fora-epoca').classList.contains('is-today')).toBe(true)
    expect(document.querySelectorAll('.today-badge')).toHaveLength(2)
    vi.useRealTimers()
  })

  it('Ciência Viva aparece de terça a domingo e Capela dos Ossos não ao domingo', () => {
    expect(html).toMatch(/data-days="terca,quarta,quinta,sexta,sabado,domingo">\s*<h3[^>]*centro_cincia_viva/)
    expect(html).toMatch(/data-days="segunda,terca,quarta,quinta,sexta,sabado">\s*<h3[^>]*capela_dos_ossos/)
  })
})
