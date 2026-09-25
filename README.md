# Anime & manga catalog

Next.js 14 catalog powered by the [AniList GraphQL API](https://docs.anilist.co/).

## Development

```sh
npm install
npm run dev
```

Public catalog queries need no API key or environment variable. The former
`NEXT_PUBLIC_BASE_URL` setting for Jikan is ignored.

## Data integration

- `config/services/anilist.ts` queries AniList and adapts responses to the existing UI model.
- Search, filters, rankings, releasing/upcoming titles, details, characters, staff,
  recommendations, review summaries, and the weekly airing schedule use AniList.
- New links use `/anime/anilist-154587` or `/manga/anilist-30002`.
  Numeric legacy links are resolved using AniList's `idMal` field. Old MAL genre
  filter IDs are not supported; genre filters now use names.
- Scores are converted from 100 to 10. Missing scores stay unknown.
- Pagination uses `hasNextPage`; AniList's inaccurate totals are not displayed.
- The schedule uses UTC calendar days for the current week, with up to 50 airing
  entries queried per day and up to 25 distinct safe titles displayed.
- “Surprise me” selects from the first five pages of popular titles (up to 250) for the chosen media type.
- Safe manga results are filtered on the server: the upstream `isAdult: false`
  filter currently returns empty general manga lists. Pages can contain fewer
  items after this filter; navigation follows upstream `hasNextPage`.
- Manga formats are Manga, Novel and Oneshot; Jikan-specific formats were removed.
- Successful queries are cached on the server for one hour. Uncached requests
  are spaced 2.1 seconds apart per server process, with a 15-second timeout.
  This is not a shared rate limiter across serverless instances: a larger deployment
  needs a shared request budget. Errors are not cached as valid catalog data.
- Detail requests are deduplicated during rendering. API failures show a retry
  state rather than being treated as a missing title.

AniList's documented temporary limit is 30 requests/minute. Review the current
[limits](https://docs.anilist.co/guide/rate-limiting) and
[terms](https://docs.anilist.co/guide/terms-of-use) before publishing. The terms
restrict competing list/tracker services. This project does not implement user lists.

## Checks

```sh
node --test tests/anilist.test.cjs
npm run typecheck
npm run build
```

Tests cover ID routing, score conversion, pagination, filters, and GraphQL errors.
