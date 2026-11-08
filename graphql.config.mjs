// GraphQL-Markdown's settings for the Management API reference - see https://graphql-markdown.dev/docs/settings.
// astro.config.mjs runs it before every build; schema/management.json is written by ticketing's
// "API Reference Release" workflow
import { fileURLToPath } from "node:url";

export default {
	schema: "./schema/management.json",
	extensions: {
		"graphql-markdown": {
			rootPath: "./src/content/docs",
			baseURL: "api/management",
			linkRoot: "/",
			homepage: "./src/api/management/index.md",
			loaders: {
				JsonFileLoader: "@graphql-tools/json-file-loader",
			},
			docOptions: {
				// starlight takes no {#id} permalinks
				sectionHeaderId: false,
				frontMatter: { prev: false, next: false },
			},
			printTypeOptions: {
				typeBadges: true,
				// not honoured by 1.2.0 - src/modules/graphql-markdown.cjs drops the prefix until it is
				parentTypePrefix: false,
			},
			// an absolute path - graphql-markdown resolves a relative one from inside its own package
			formatter: fileURLToPath(new URL("./src/modules/graphql-markdown.cjs", import.meta.url)),
			telemetry: false,
		},
	},
};
