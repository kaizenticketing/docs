# ticketing-docs

The partner documentation at [docs.ktckts.com](https://docs.ktckts.com), built with
[Astro Starlight](https://starlight.astro.build).

Pages live in `src/content/docs`. Anything in `public/` is served as-is, which is
where the datafeed sample JSON files sit.

## The Management API reference

`src/content/docs/api/management/` is generated - do not edit it, and git ignores
it. [GraphQL-Markdown](https://graphql-markdown.dev) writes it from
`schema/management.json` before every `astro dev` and `astro build` (the
integration in `astro.config.mjs`, with its settings in `graphql.config.mjs`): a
page per query and mutation under Operations, and a page per type under Types.
`src/api/management/index.md` is its overview page.

- `src/modules/graphql-markdown.cjs` extends GraphQL-Markdown's Starlight
  formatter to drop the parent prefix (`saveEvent.andPublish`), which its
  `parentTypePrefix` setting should do but does not in 1.2.0.
- `src/styles/custom.css` keeps its argument and field headings at body size.

`schema/management.json` comes from ticketing's "API Reference Release" workflow,
which writes it here, as the `ticketing-release-sync` GitHub App, for every
published release. It is the management schema without what only Kaizen users
can reach, so it holds nothing that is not on the site. Without it, the reference
is the overview page alone.

To see the reference with a schema of your own, put an introspection result
(`{ "__schema": ... }`) at `schema/management.json`, run `pnpm dev`, and do not
commit it.

## Deploying

Cloudflare Workers Builds builds and deploys every push to `main`. The build
command lives in the Cloudflare dashboard, not in this repository, so a change
of toolchain here needs the command changed there to match.

`wrangler.toml` points Cloudflare at `dist/` and holds the `docs.ktckts.com`
custom domain.
