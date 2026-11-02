# ticketing-docs

The partner documentation at [docs.ktckts.com](https://docs.ktckts.com), built with
[Astro Starlight](https://starlight.astro.build).

Pages live in `src/content/docs`. Anything in `public/` is served as-is, which is
where the datafeed sample JSON files sit.

## The Management API reference

`src/content/docs/management-api/` is generated - do not edit it, and git ignores
it. `scripts/api-reference.mjs` writes it from `schema/management.json` before
every `astro dev` and `astro build`: an overview, a page per group of queries and
mutations, and a page per type.

`schema/management.json` comes from ticketing's "API Reference Release" workflow,
which writes it here, as the `ticketing-release-sync` GitHub App, for every
published release. It is the management schema without what only Kaizen users
can reach, so it holds nothing that is not on the site. Without it, the reference
is one page saying it appears with the next release.

To see the reference with a schema of your own, put an introspection result
(`{ "__schema": ... }`) at `schema/management.json`, run `pnpm dev`, and do not
commit it.

## Running it

```bash
pnpm install
pnpm dev
```

`pnpm build` writes the site to `dist/`, and `pnpm preview` serves that build.

## Deploying

Cloudflare Workers Builds builds and deploys every push to `main`. The build
command lives in the Cloudflare dashboard, not in this repository, so a change
of toolchain here needs the command changed there to match.

`wrangler.toml` points Cloudflare at `dist/` and holds the `docs.ktckts.com`
custom domain.
