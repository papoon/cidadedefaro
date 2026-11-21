import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { lisbonNow, findSeason, tripsForDay, routeStatus, toMinutes } from '../src/data/barcos.js'

const data = JSON.parse(readFileSync(resolve(process.cwd(), 'assets/data/barcos.json'), 'utf8'))
const farol = data.routes.find((r) => r.id === 'farol')
const culatra = data.routes.find((r) => r.id === 'culatra')
const at = (md, hhmm) => ({ year: 2026, md, minutes: toMinutes(hhmm) })

describe('barcos.json', () => {
  it('tem épocas válidas e viagens com regresso depois da partida', () => {
    for (const route of data.routes) {
      for (const s of route.seasons) {
        expect(s.from <= s.to).toBe(true)
        for (const trip of s.trips) expect(toMinutes(trip.back)).toBeGreaterThan(toMinutes(trip.out))
      }
      expect(Object.keys(route.prices).sort()).toEqual(['return_adult', 'return_child', 'single_adult', 'single_child'])
    }
  })
})

describe('lisbonNow', () => {
  it('converte para hora de Lisboa (verão = UTC+1)', () => {
    expect(lisbonNow(new Date('2026-07-31T23:30:00Z'))).toEqual({ year: 2026, md: '08-01', minutes: 30 })
  })
})

describe('épocas e viagens', () => {
  it('sem época fora de maio–outubro', () => {
    expect(findSeason(farol, '11-21')).toBeNull()
    expect(findSeason(farol, '04-30')).toBeNull()
    expect(findSeason(culatra, '05-15')).toBeNull()
  })

  it('limites de época inclusivos', () => {
    expect(findSeason(farol, '05-01').from).toBe('05-01')
    expect(findSeason(farol, '09-15').from).toBe('06-01')
    expect(findSeason(farol, '09-16').from).toBe('09-16')
    expect(findSeason(farol, '10-31').from).toBe('09-16')
  })

  it('a viagem das 18:45 só existe até 31 de agosto', () => {
    expect(tripsForDay(farol, '08-31').map((t) => t.out)).toContain('18:45')
    expect(tripsForDay(farol, '09-01').map((t) => t.out)).not.toContain('18:45')
  })
})

describe('routeStatus', () => {
  it('fora de época', () => {
    const s = routeStatus(farol, at('11-21', '10:00'))
    expect(s.inSeason).toBe(false)
    expect(s.lastBack).toBeNull()
  })

  it('próxima partida e último regresso em agosto', () => {
    const s = routeStatus(farol, at('08-10', '11:00'))
    expect(s.nextOut).toBe('12:25')
    expect(s.lastBack).toBe('19:30')
    expect(s.lastBackPassed).toBe(false)
  })

  it('último regresso em setembro deixa de ser 19:30', () => {
    expect(routeStatus(farol, at('09-05', '09:00')).lastBack).toBe('18:00')
  })

  it('depois da última partida e do último regresso', () => {
    const s = routeStatus(culatra, at('07-01', '16:00'))
    expect(s.nextOut).toBeNull()
    expect(s.lastBack).toBe('15:35')
    expect(s.lastBackPassed).toBe(true)
  })
})
