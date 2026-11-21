import { describe, it, expect } from 'vitest'
import { SearchManager } from '../src/utils/search.js'

const sm = new SearchManager()

describe('SearchManager.search', () => {
  it('devolve [] para pesquisas vazias', () => {
    expect(sm.search('')).toEqual([])
    expect(sm.search('   ')).toEqual([])
  })

  it('põe a página de Saúde em primeiro para "saúde"', () => {
    const [first] = sm.search('Saúde')
    expect(first.id).toBe('page-saude')
  })

  it('ordena por score decrescente', () => {
    const results = sm.search('faro')
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score)
    }
  })

  it('não rebenta com caracteres especiais de regex', () => {
    expect(() => sm.search('(*[')).not.toThrow()
  })
})

describe('SearchManager.highlightMatch', () => {
  it('envolve o termo em <mark> sem distinguir maiúsculas', () => {
    expect(sm.highlightMatch('Mapa de Faro', 'faro')).toBe('Mapa de <mark>Faro</mark>')
  })
})

describe('SearchManager.getSuggestions', () => {
  it('devolve no máximo 5 sugestões', () => {
    expect(sm.getSuggestions('a').length).toBeLessThanOrEqual(5)
    expect(sm.getSuggestions('')).toEqual([])
  })
})
