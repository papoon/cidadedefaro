import { describe, it, expect } from 'vitest'
import { parseLisbonTime, selectFaroWarnings, toAlert } from '../src/data/avisos-ipma.js'

describe('parseLisbonTime', () => {
  it('inverno: Lisboa = UTC', () => {
    expect(parseLisbonTime('2026-11-21T12:00:00')).toBe(Date.parse('2026-11-21T12:00:00Z'))
  })
  it('verão: Lisboa = UTC+1', () => {
    expect(parseLisbonTime('2026-07-15T12:00:00')).toBe(Date.parse('2026-07-15T11:00:00Z'))
  })
  it('aceita sem segundos e rejeita lixo', () => {
    expect(parseLisbonTime('2026-11-21T12:00')).toBe(Date.parse('2026-11-21T12:00:00Z'))
    expect(parseLisbonTime('ontem')).toBeNaN()
    expect(parseLisbonTime(undefined)).toBeNaN()
  })
})

const NOW = Date.parse('2026-07-15T11:00:00Z') // 12:00 em Lisboa
const w = (over) => ({
  idAreaAviso: 'FAR', awarenessTypeName: 'Tempo Quente', awarenessLevelID: 'yellow',
  startTime: '2026-07-15T09:00:00', endTime: '2026-07-15T21:00:00', text: '', ...over
})

describe('selectFaroWarnings', () => {
  it('ignora verdes, outras áreas e respostas inválidas', () => {
    expect(selectFaroWarnings(null, NOW)).toEqual([])
    expect(selectFaroWarnings([w({ awarenessLevelID: 'green' }), w({ idAreaAviso: 'LSB' })], NOW)).toEqual([])
  })

  it('ignora avisos terminados e os que começam daqui a mais de 24h', () => {
    const list = [
      w({ startTime: '2026-07-14T09:00:00', endTime: '2026-07-15T11:00:00' }), // acabou às 11h
      w({ startTime: '2026-07-16T13:00:00', endTime: '2026-07-16T20:00:00' }) // começa em 25h
    ]
    expect(selectFaroWarnings(list, NOW)).toEqual([])
  })

  it('inclui avisos futuros dentro das próximas 24h', () => {
    const [r] = selectFaroWarnings([w({ startTime: '2026-07-16T09:00:00', endTime: '2026-07-16T20:00:00' })], NOW)
    expect(r.start).toBeGreaterThan(NOW)
  })

  it('fica com o nível mais alto por tipo e ordena por gravidade', () => {
    const list = [
      w({ awarenessLevelID: 'yellow' }),
      w({ awarenessLevelID: 'orange', startTime: '2026-07-15T14:00:00' }),
      w({ awarenessTypeName: 'Vento', awarenessLevelID: 'yellow' }),
      w({ awarenessTypeName: 'Agitação Marítima', awarenessLevelID: 'red' })
    ]
    const r = selectFaroWarnings(list, NOW)
    expect(r.map((x) => [x.type, x.level])).toEqual([
      ['Agitação Marítima', 'red'],
      ['Tempo Quente', 'orange'],
      ['Vento', 'yellow']
    ])
  })
})

describe('toAlert', () => {
  const dict = {
    'ipma_warnings.title': 'IPMA {level} warning: {type}',
    'ipma_warnings.level_orange': 'orange',
    'ipma_warnings.type_heat': 'hot weather',
    'ipma_warnings.when_now': 'In effect until {end}',
    'ipma_warnings.area': 'Faro district. {when}.',
    'ipma_warnings.source': 'Source: IPMA.'
  }
  const t = (k) => dict[k] || null

  it('traduz título e usa tipo "important" para laranja/vermelho', () => {
    const [warning] = selectFaroWarnings([w({ awarenessLevelID: 'orange', text: 'Persistência de valores elevados' })], NOW)
    const a = toAlert(warning, t, 'en', NOW)
    expect(a.title).toBe('IPMA orange warning: hot weather')
    expect(a.type).toBe('important')
    expect(a.message).toMatch(/^Faro district\. In effect until .+\. Source: IPMA\.$/)
    expect(a.message).not.toContain('Persistência') // texto do IPMA só em PT
    expect(a.id).toBe(`ipma-FAR-heat-orange-${warning.start}`)
  })

  it('em PT inclui o texto descritivo do IPMA e cai para PT sem traduções', () => {
    const [warning] = selectFaroWarnings([w({ text: 'Tempo quente.' })], NOW)
    const a = toAlert(warning, () => null, 'pt', NOW)
    expect(a.type).toBe('warning')
    expect(a.message).toContain('Tempo quente.')
    expect(a.title).toBe('Aviso yellow: Tempo Quente')
  })
})
