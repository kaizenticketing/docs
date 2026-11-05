import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import fs from "node:fs";
import { runGraphQLMarkdown } from "@graphql-markdown/cli";

export default defineConfig({
	site: "https://docs.ktckts.com",
	integrations: [
		// GraphQL-Markdown writes the Management API reference (graphql.config.mjs) before starlight reads the pages; until a
		// release has written schema/management.json, the reference is its overview alone
		{
			name: "management-api-reference",
			hooks: {
				"astro:config:setup": async () => {
					fs.rmSync("./src/content/docs/api/management", { recursive: true, force: true });
					if (fs.existsSync("./schema/management.json")) {
						await runGraphQLMarkdown({ id: "default" }, { force: true });
					} else {
						fs.mkdirSync("./src/content/docs/api/management", { recursive: true });
						fs.copyFileSync("./src/api/management/index.md", "./src/content/docs/api/management/index.md");
					}
				},
			},
		},
		starlight({
			title: "Kaizen Ticketing",
			description: "Guides for partners who integrate with the Kaizen Ticketing platform.",
			logo: {
				light: "./src/assets/kaizen-logo.png",
				dark: "./src/assets/kaizen-logo-dark.png",
				replacesTitle: true,
				alt: "Kaizen Ticketing",
			},
			favicon: "/favicon.png",
			customCss: ["./src/styles/custom.css"],
			head: [
				// starlight sets twitter:card to summary_large_image but ships no image,
				// so link unfurls in Slack and elsewhere come out bare without these
				{ tag: "meta", attrs: { property: "og:image", content: "https://docs.ktckts.com/og-image.png" } },
				{ tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
				{ tag: "meta", attrs: { property: "og:image:height", content: "630" } },
				{ tag: "meta", attrs: { name: "twitter:image", content: "https://docs.ktckts.com/og-image.png" } },
				{ tag: "link", attrs: { rel: "preconnect", href: "https://fonts.googleapis.com" } },
				{ tag: "link", attrs: { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: true } },
				{
					tag: "link",
					attrs: {
						rel: "stylesheet",
						href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap",
					},
				},
			],
			sidebar: [
				{ label: "Datafeeds", link: "/datafeeds/" },
				{ label: "Scheduled Exports", link: "/scheduled-exports/" },
				{
					label: "API",
					items: [
						{
							label: "Management",
							items: [
								{ label: "Overview", link: "/api/management/" },
								{ label: "kz", link: "/kz/" },
								{ label: "Operations", collapsed: true, items: [{ autogenerate: { directory: "api/management/operations" } }] },
								{ label: "Types", collapsed: true, items: [{ autogenerate: { directory: "api/management/types" } }] },
							],
						},
					],
				},
			],
		}),
	],
});
