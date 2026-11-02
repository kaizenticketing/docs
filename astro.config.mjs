import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { writeApiReference } from "./scripts/api-reference.mjs";

export default defineConfig({
	site: "https://docs.ktckts.com",
	integrations: [
		// the Management API reference is generated from schema/management.json before starlight reads the pages
		{ name: "api-reference", hooks: { "astro:config:setup": () => writeApiReference() } },
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
					label: "Management API",
					items: [
						{ label: "Overview", link: "/management-api/" },
						{ label: "kz", link: "/kz/" },
						{ label: "Groups", items: [{ autogenerate: { directory: "management-api/groups" } }] },
						{ label: "Types", collapsed: true, items: [{ autogenerate: { directory: "management-api/types" } }] },
					],
				},
			],
		}),
	],
});
