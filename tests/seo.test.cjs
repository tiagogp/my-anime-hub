const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const Module = require('node:module')
const ts = require('typescript')

function load(file, mocks = {}) {
  const filename = path.resolve(file)
  const mod = new Module(filename, module)
  mod.filename = filename
  mod.paths = module.paths
  mod.require = id => {
    if (Object.hasOwn(mocks, id)) return mocks[id]
    if (id.startsWith('@/')) return load(`${id.slice(2)}.ts`, mocks)
    return require(id)
  }
  mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 }
  }).outputText, filename)
  return mod.exports
}
const seo = load('lib/seo.ts')
const origin = 'https://myanimehub.tiagogp.com'

test('paginated catalogs have distinct titles and self-canonicals', () => {
  const first = seo.catalogMetadata('/anime/top-anime', 'Top Anime', 'Anime rankings.', { page: '1', utm_source: 'test' })
  const second = seo.catalogMetadata('/anime/top-anime', 'Top Anime', 'Anime rankings.', { page: '2' })
  assert.equal(first.alternates.canonical, `${origin}/anime/top-anime`)
  assert.equal(second.alternates.canonical, `${origin}/anime/top-anime?page=2`)
  assert.match(second.title.absolute, /Page 2/)
  assert.equal(second.robots.index, true)
  for (const page of ['-1', 'Infinity', '1.5', 'garbage']) {
    assert.equal(seo.catalogMetadata('/anime', 'Anime', 'Catalog.', { page }).alternates.canonical, `${origin}/anime`)
  }
})

test('searches and faceted filters are noindex but their links remain followable', () => {
  const meta = seo.catalogMetadata('/anime', 'Anime', 'Catalog.', { search: 'Frieren & friends', genres: 'Fantasy', page: '2' })
  const url = new URL(meta.alternates.canonical)
  assert.equal(url.searchParams.get('search'), 'Frieren & friends')
  assert.equal(url.searchParams.get('genres'), 'Fantasy')
  assert.equal(meta.robots.index, false)
  assert.equal(meta.robots.follow, true)
})

test('detail aliases share the native canonical and title-specific social metadata', () => {
  const media = { mal_id: 1, route_id: 'anilist-114129', title: 'Gintama: THE FINAL', type: 'MOVIE', synopsis: 'A story. '.repeat(60), images: { webp: { large_image_url: 'https://s4.anilist.co/cover.jpg' } } }
  const meta = seo.mediaMetadata(media, 'anime')
  assert.equal(meta.alternates.canonical, `${origin}/anime/anilist-114129`)
  assert.equal(meta.openGraph.url, meta.alternates.canonical)
  assert.deepEqual(meta.twitter.images, ['https://s4.anilist.co/cover.jpg'])
  assert.ok(meta.description.length <= 160)
  assert.match(meta.openGraph.title, /Gintama/)
  const schema = seo.mediaStructuredData(media, 'anime')
  assert.equal(schema['@graph'][0]['@type'], 'Movie')
  assert.equal(schema['@graph'][1].itemListElement[2].item, meta.alternates.canonical)
  assert.equal(schema['@graph'][0].aggregateRating, undefined)
})

test('structured data cannot close its script through external titles or descriptions', () => {
  const payload = { name: '</script><script>alert(1)</script>' }
  const serialized = seo.serializeJsonLd(payload)
  assert.equal(serialized.includes('<'), false)
  assert.deepEqual(JSON.parse(serialized), payload)
})

test('sitemap deduplicates native IDs and preserves static routes during API failures', async () => {
  const title = { mal_id: 1, route_id: 'anilist-21' }
  const sitemap = load('app/sitemap.ts', {
    '@/config/services/top': { getTopAnime: async () => ({ data: [title] }), getTopManga: async () => { throw new Error('API unavailable') } },
    '@/config/services/seasons': { getSessionNow: async () => ({ data: [title] }), getSessionUpcoming: async () => ({ data: [] }) }
  }).default
  const result = await sitemap()
  assert.ok(result.some(item => item.url === `${origin}/manga`))
  assert.equal(result.filter(item => item.url === `${origin}/anime/anilist-21`).length, 1)
  assert.equal(result.some(item => item.lastModified), false)
  assert.ok(result.every(item => item.url.startsWith(origin)))
})

test('previews are excluded while production robots points at the public sitemap', () => {
  const publicRobots = load('app/robots.ts').default()
  assert.equal(publicRobots.sitemap, `${origin}/sitemap.xml`)
  assert.equal(publicRobots.rules.allow, '/')
  const preview = load('app/robots.ts', { '@/config/seo': { IS_PREVIEW: true } }).default()
  assert.equal(preview.rules.disallow, '/')
})
