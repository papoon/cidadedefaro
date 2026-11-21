import { describe, it, expect, vi, afterEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const page = readFileSync(resolve(process.cwd(), 'mapa.html'), 'utf8')
const mainHtml = page.match(/<main[\s\S]*<\/main>/)[0]

// Leaflet mínimo: regista o que é adicionado ao mapa
function fakeLeaflet() {
  const onMap = new Set()
  const layer = () => {
    const l = {
      children: [],
      addTo(target) { (target === map ? onMap.add(l) : target.children.push(l)); return l },
      bindPopup(content) { l.popup = content; return l },
      openPopup() { return l },
      clearLayers() { l.children = [] },
      eachLayer(fn) { l.children.forEach(fn) }
    }
    return l
  }
  const map = {
    setView() { return map },
    hasLayer: (l) => onMap.has(l),
    addLayer: (l) => onMap.add(l),
    removeLayer: (l) => onMap.delete(l)
  }
  return {
    onMap,
    L: {
      map: () => map,
      tileLayer: () => layer(),
      marker: () => layer(),
      layerGroup: () => layer(),
      divIcon: (o) => o
    }
  }
}

const overpassResponse = {
  elements: [
    { type: 'node', id: 1, lat: 37.02, lon: -7.93, tags: { name: 'Vet <b>Teste</b>', phone: '+351 289 000 000', opening_hours: 'Mo-Fr 09:00-19:00' } },
    { type: 'way', id: 2, center: { lat: 37.03, lon: -7.94 }, tags: {} },
    { type: 'node', id: 3, tags: {} } // sem coordenadas: ignorado
  ]
}

async function load(search = '') {
  vi.resetModules()
  document.body.innerHTML = mainHtml
  window.history.replaceState(null, '', `/mapa.html${search}`)
  const fake = fakeLeaflet()
  vi.stubGlobal('L', fake.L)
  const fetchMock = vi.fn(async () => ({ ok: true, json: async () => overpassResponse }))
  vi.stubGlobal('fetch', fetchMock)
  const mod = await import('../src/data/mapa.js')
  return { mod, fake, fetchMock }
}

afterEach(() => vi.unstubAllGlobals())

describe('funções puras', () => {
  it('construirQueryCamada inclui todos os filtros e o raio', async () => {
    const { mod } = await load()
    const q = mod.construirQueryCamada('wc_acessivel', { lat: 1, lng: 2 }, 500, 10)
    expect(q).toContain('[out:json][timeout:10]')
    expect(q).toContain('nwr["amenity"="toilets"]["wheelchair"~"^(yes|designated)$"](around:500,1,2);')
    expect(q).toContain('nwr["toilets:wheelchair"="yes"](around:500,1,2);')
    expect(q).toContain('out center tags;')
    expect(() => mod.construirQueryCamada('nao-existe')).toThrow()
  })

  it('camadasDoUrl aceita só ids conhecidos, sem duplicados', async () => {
    const { mod } = await load()
    expect(mod.camadasDoUrl('?camada=veterinario,parque_canino,xpto,veterinario')).toEqual(['veterinario', 'parque_canino'])
    expect(mod.camadasDoUrl('')).toEqual([])
  })

  it('cada camada tem uma checkbox em mapa.html e uma tradução', async () => {
    const { mod } = await load()
    const pt = JSON.parse(readFileSync(resolve(process.cwd(), 'assets/lang/pt.json'), 'utf8'))
    for (const id of Object.keys(mod.CAMADAS)) {
      expect(document.getElementById(`camada-${id}`)).not.toBeNull()
      expect(pt.map[`layer_${id}`]).toBeTruthy()
    }
  })
})

describe('alternar camadas', () => {
  it('carrega uma vez, mostra/esconde, anuncia contagem e não interpreta HTML do OSM', async () => {
    const { fake, fetchMock } = await load()
    const box = document.getElementById('camada-veterinario')
    box.checked = true
    box.dispatchEvent(new Event('change'))
    const status = document.getElementById('camadas-status')
    await vi.waitFor(() => expect(status.textContent).toBe('Veterinário: 2'))
    expect(fetchMock).toHaveBeenCalledOnce()

    const group = [...fake.onMap].find((l) => l.children.length === 2)
    const popup = group.children[0].popup
    expect(popup.querySelector('strong').textContent).toBe('Vet <b>Teste</b>')
    expect(popup.querySelector('b')).toBeNull()
    expect(popup.querySelector('a[href^="tel:"]').getAttribute('href')).toBe('tel:+351289000000')

    box.checked = false
    box.dispatchEvent(new Event('change'))
    expect(fake.onMap.has(group)).toBe(false)

    box.checked = true
    box.dispatchEvent(new Event('change'))
    await vi.waitFor(() => expect(fake.onMap.has(group)).toBe(true))
    expect(fetchMock).toHaveBeenCalledOnce() // reutiliza o grupo já carregado
  })

  it('ativa camadas pedidas no URL', async () => {
    const { fetchMock } = await load('?camada=coworking')
    expect(document.getElementById('camada-coworking').checked).toBe(true)
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledOnce())
    expect(decodeURIComponent(fetchMock.mock.calls[0][1].body)).toContain('coworking_space')
  })

  it('em erro desmarca a camada e avisa', async () => {
    const { fetchMock } = await load()
    fetchMock.mockImplementation(async () => ({ ok: false, status: 504 }))
    const box = document.getElementById('camada-coworking')
    box.checked = true
    box.dispatchEvent(new Event('change'))
    await vi.waitFor(() => expect(box.checked).toBe(false))
    expect(document.getElementById('camadas-status').textContent).toMatch(/Não foi possível/)
  })
})
