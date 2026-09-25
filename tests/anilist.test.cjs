const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const Module = require('node:module')
const ts = require('typescript')
// Exercise the real adapter without Next's request runtime or external traffic.
const source = fs.readFileSync('config/services/anilist.ts', 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 } }).outputText
const mod = new Module(require('node:path').resolve('config/services/anilist.ts'), module)
mod.filename = require("node:path").resolve("config/services/anilist.ts")
mod.paths = module.paths
mod.require = id => {
 if (id === 'react') return { cache: fn => fn }
 if (id === 'next/cache') return { unstable_cache: fn => fn }
 return require(id)
}
mod._compile(compiled, mod.filename)
const { mapMedia, routeId, pagination, listMedia, graphql, getMedia } = mod.exports
const media = { isAdult: false, id: 154587, idMal: 52991, siteUrl: 'https://anilist.co/anime/154587', type: 'ANIME', format: 'TV', status: 'FINISHED', title: { romaji: 'Frieren', english: null, native: null }, coverImage: { extraLarge: 'cover.jpg', medium: 'small.jpg' }, averageScore: 91, popularity: 100, favourites: 20, episodes: 28, chapters: null, volumes: null, duration: 24, genres: ['Fantasy'], rankings: [{ allTime: true, type: 'RATED', rank: 1 }], startDate: { year: 2023, month: 9, day: 29 }, endDate: {}, description: '<b>Hello</b> &amp; goodbye', trailer: { site: 'youtube', id: 'abc' } }
test('preserves MAL identity but generates unambiguous AniList links and converts scores', () => {
 const mapped = mapMedia(media)
 assert.equal(mapped.mal_id, 52991)
 assert.equal(mapped.route_id, 'anilist-154587')
 assert.equal(mapped.score, 9.1)
 assert.equal(mapped.synopsis, 'Hello & goodbye')
 assert.equal(mapped.trailer.embed_url, 'https://www.youtube.com/embed/abc')
 assert.equal(mapMedia({ ...media, idMal: null, averageScore: null, trailer: { site: 'dailymotion', id: 'abc' } }).score, null)
 assert.equal(mapMedia({ ...media, trailer: null }).trailer.embed_url, '')
 assert.equal(routeId({ id: 1 }), 'anilist-1')
})
test('pagination exposes only known pages rather than inventing a total', () => {
 assert.equal(pagination(2, 25, true, 25).last_visible_page, 3)
 assert.equal(pagination(2, 25, false, 7).last_visible_page, 2)
})
test('provides the background color without needing to download cover pixels', () => {
 const colored = mapMedia({ ...media, coverImage: { ...media.coverImage, color: '#c93621' } })
 assert.equal(colored.cover_color, '#c93621')
 assert.equal(mapMedia(media).cover_color, null)
 assert.equal(mapMedia({ ...media, coverImage: { ...media.coverImage, color: null } }).cover_color, null)
})
test('invalid legacy/native IDs do not make API requests', async () => {
 assert.equal(await getMedia('ANIME', 'garbage'), null)
 assert.equal(await getMedia('ANIME', '-1'), null)
})
test('search/filter variables and GraphQL errors are handled correctly', async () => {
 const originalFetch = global.fetch
 const calls = []
 global.fetch = async (_url, init) => {
   calls.push(JSON.parse(init.body))
   return Response.json({ data: { Page: { pageInfo: { currentPage: 2, hasNextPage: true }, media: [media] } } })
 }
 try {
  const result = await listMedia('ANIME', { page: 2, genres: 'Fantasy', type: 'TV', status: 'airing', q: 'Frieren & friends', order_by: 'score', sort: 'asc' })
  assert.deepEqual(calls[0].variables.genres, ['Fantasy'])
  assert.equal(calls[0].variables.search, 'Frieren & friends')
  assert.equal(calls[0].variables.format, 'TV')
  assert.equal(calls[0].variables.status, 'RELEASING')
  assert.equal(calls[0].variables.adult, false)
  assert.deepEqual(calls[0].variables.sort, ['SCORE'])
  assert.equal(result.pagination.has_next_page, true)
  global.fetch = async (_url, init) => {
    const variables = JSON.parse(init.body).variables
    assert.equal(variables.adult, undefined)
    return Response.json({ data: { Page: { pageInfo: { currentPage: 1, hasNextPage: true }, media: [media, { ...media, id: 2, isAdult: true }] } } })
  }
  const manga = await listMedia('MANGA', {})
  assert.equal(manga.data.length, 1)
  assert.equal(manga.data[0].route_id, 'anilist-154587')
  global.fetch = async () => Response.json({ errors: [{ message: 'Unavailable', status: 503 }] })
  await assert.rejects(graphql('{ Media { id } }'), error => error.status === 503)
  global.fetch = async () => Response.json({ errors: [{ message: 'Not found', status: 404 }] }, { status: 404 })
  assert.equal(await getMedia('ANIME', '999999999'), null)
 } finally { global.fetch = originalFetch }
})
test('random manga falls back to page one when the sampled page is empty', async () => {
 const calls = []
 const randomModule = new Module(require('node:path').resolve('config/services/random.ts'), module)
 randomModule.filename = require('node:path').resolve('config/services/random.ts')
 randomModule.require = id => {
  if (id === './anilist') return { listMedia: async (type, params) => {
    calls.push({ type, ...params })
    return { data: calls.length === 1 ? [] : [mapMedia(media)] }
  } }
  return require(id)
 }
 randomModule._compile(ts.transpileModule(fs.readFileSync(randomModule.filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 } }).outputText, randomModule.filename)
 const result = await randomModule.exports.getRandomManga()
 assert.equal(calls[0].type, 'MANGA')
 assert.equal(calls[1].page, 1)
 assert.equal(result.data.route_id, 'anilist-154587')
})
