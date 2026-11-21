import { describe, it, expect, beforeEach } from 'vitest'
import { FavoritesManager } from '../src/utils/favorites.js'

describe('FavoritesManager', () => {
  beforeEach(() => localStorage.clear())

  it('adiciona, deteta e remove favoritos', () => {
    const fm = new FavoritesManager()
    expect(fm.addFavorite('a', 'page', 'Saúde', 'saude.html')).toBe(true)
    expect(fm.isFavorite('a')).toBe(true)
    expect(fm.removeFavorite('a')).toBe(true)
    expect(fm.isFavorite('a')).toBe(false)
    expect(fm.removeFavorite('a')).toBe(false)
  })

  it('não duplica o mesmo id', () => {
    const fm = new FavoritesManager()
    fm.addFavorite('a', 'page', 'A', 'a.html')
    expect(fm.addFavorite('a', 'page', 'A', 'a.html')).toBe(false)
    expect(fm.getAllFavorites()).toHaveLength(1)
  })

  it('persiste em localStorage entre instâncias', () => {
    new FavoritesManager().addFavorite('x', 'location', 'Sé', 'mapa.html')
    const again = new FavoritesManager()
    expect(again.isFavorite('x')).toBe(true)
    expect(again.getFavoritesByType('location')).toHaveLength(1)
    expect(again.getFavoritesByType('page')).toHaveLength(0)
  })

  it('recupera de JSON corrompido em localStorage', () => {
    localStorage.setItem('faroGuide_favorites', '{not json')
    expect(new FavoritesManager().getAllFavorites()).toEqual([])
  })

  it('importa só arrays válidos', () => {
    const fm = new FavoritesManager()
    expect(fm.importFavorites('{"a":1}')).toBe(false)
    expect(fm.importFavorites('lixo')).toBe(false)
    expect(fm.importFavorites(JSON.stringify([{ id: 'z', type: 'page' }]))).toBe(true)
    expect(fm.isFavorite('z')).toBe(true)
  })

  it('getAllFavorites devolve uma cópia', () => {
    const fm = new FavoritesManager()
    fm.addFavorite('a', 'page', 'A', 'a.html')
    fm.getAllFavorites().pop()
    expect(fm.getAllFavorites()).toHaveLength(1)
  })
})
