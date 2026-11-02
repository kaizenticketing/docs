// Writes the Management API reference - src/content/docs/management-api/ - from schema/management.json, before
// every build. ticketing's "API Reference Release" workflow writes that file for each release, already without the
// Kaizen-only parts, so this renders all of it.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schemaFile = path.join(root, "schema", "management.json");
const outDir = path.join(root, "src", "content", "docs", "management-api");

export const endpoint = "https://api.ktckts.com/management";
const base = "/management-api";

export function writeApiReference() {
	fs.rmSync(outDir, { recursive: true, force: true });
	fs.mkdirSync(path.join(outDir, "groups"), { recursive: true });
	fs.mkdirSync(path.join(outDir, "types"), { recursive: true });

	if (!fs.existsSync(schemaFile)) {
		write("index.md", page("Management API", "The GraphQL API behind the box office.", [
			"The reference appears here with the next release of the platform.",
		]));
		return;
	}

	const copy = JSON.parse(fs.readFileSync(schemaFile, "utf8"));
	const schema = copy.__schema;
	const types = new Map(schema.types.filter(x => !x.name.startsWith("__")).map(x => [x.name, x]));
	const query = types.get(schema.queryType.name);
	const mutation = schema.mutationType ? types.get(schema.mutationType.name) : null;

	// a root field whose type is an object is a group: catalog, venues and so on
	const groups = new Map();
	const others = [];
	for (const [rootType, kind] of [[query, "query"], [mutation, "mutation"]]) {
		for (const field of rootType?.fields ?? []) {
			const type = types.get(named(field.type));
			if (type.kind !== "OBJECT") {
				others.push({ field, kind });
				continue;
			}
			const group = groups.get(field.name) ?? { name: field.name };
			group[kind] = { field, type };
			groups.set(field.name, group);
		}
	}

	const sorted = [...groups.values()].sort((a, b) => a.name.localeCompare(b.name));
	write("index.md", overview(copy.release, sorted, others));
	for (const group of sorted)
		write(`groups/${group.name.toLowerCase()}.md`, groupPage(group, types));
	for (const type of types.values())
		write(`types/${type.name.toLowerCase()}.md`, typePage(type, types));
}

// #region pages

function overview(release, groups, others) {
	const lines = [
		release ? `This reference describes release ${release} of the platform.` : "",
		"",
		"The management API is the GraphQL API behind the box office: the same groups, queries and mutations, with the same permissions. Every request is an HTTP `POST` of a GraphQL document to one address:",
		"",
		"```",
		endpoint,
		"```",
		"",
		"```bash",
		`curl ${endpoint} \\`,
		"  -H \"Authorization: Bearer $TOKEN\" \\",
		"  -H \"Content-Type: application/json\" \\",
		"  -d '{ \"query\": \"query { version }\" }'",
		"```",
		"",
		"## Signing in",
		"",
		"Every request carries an access token in its `Authorization` header. How your software gets a token of its own is not published yet - ask your Kaizen contact.",
		"",
		"## Groups",
		"",
		"Every query and mutation sits in a group, so a document names the group first:",
		"",
		"```graphql",
		"query {",
		"  catalog {",
		"    event(first: 10) {",
		"      edges { node { id code name { unlocalisedString } } }",
		"    }",
		"  }",
		"}",
		"```",
		"",
		"| Group | |",
		"| :--- | :--- |",
		...groups.map(x => `| [${x.name}](${base}/groups/${x.name.toLowerCase()}/) | ${cell(firstSentence((x.query ?? x.mutation).field.description))} |`),
		"",
	];

	if (others.length > 0) {
		lines.push("Outside the groups:", "", "| Field | Type | |", "| :--- | :--- | :--- |");
		for (const { field, kind } of others)
			lines.push(`| \`${field.name}\` (${kind}) | ${typeRef(field.type)} | ${cell(field.description)} |`);
		lines.push("");
	}

	lines.push(
		"## Paging",
		"",
		"A query that lists returns a page: its `edges`, each with a `node`, and its `pageInfo`. `first` sets the page size, and `after` takes the `pageInfo.endCursor` of the page before to fetch the next one, while `pageInfo.hasNextPage` is true. `totalCount` counts every item, not just the page.",
		"",
		"## kz",
		"",
		"[kz](/kz/) is this API as commands, with `--help` for each one.",
	);

	return page("Management API", "The GraphQL API behind the box office: its groups, queries, mutations and types.", lines);
}

function groupPage(group, types) {
	const description = (group.query ?? group.mutation).field.description;
	const lines = [cell(description, { multiline: true }), ""];
	for (const [kind, title] of [["query", "Queries"], ["mutation", "Mutations"]]) {
		const part = group[kind];
		if (!part)
			continue;

		lines.push(`## ${title}`, "");
		if (kind === "mutation" && group.query && part.field.description && part.field.description !== group.query.field.description)
			lines.push(cell(part.field.description, { multiline: true }), "");

		for (const field of [...part.type.fields].sort((a, b) => a.name.localeCompare(b.name)))
			lines.push(...operation(field, types));
	}

	return page(title(group.name), firstSentence(description), lines);
}

function operation(field, types) {
	const lines = [`### \`${field.name}\``, ""];
	if (field.isDeprecated)
		lines.push(`**Deprecated:** ${cell(field.deprecationReason)}`, "");
	if (field.description)
		lines.push(cell(field.description, { multiline: true }), "");

	const node = connectionNode(field.type, types);
	lines.push(node
		? `**Returns** a page of ${link(node)} - see [Paging](${base}/#paging).`
		: `**Returns** ${typeRef(field.type)}.`, "");

	if (field.args.length > 0) {
		lines.push("| Argument | Type | Description |", "| :--- | :--- | :--- |");
		for (const arg of field.args)
			lines.push(`| \`${arg.name}\` | ${typeRef(arg.type)} | ${cell(argument(arg))} |`);
		lines.push("");
	}

	return lines;
}

function typePage(type, types) {
	const lines = [];
	if (type.description)
		lines.push(cell(type.description, { multiline: true }), "");

	const implemented = (type.interfaces ?? []).map(x => link(x.name));
	if (implemented.length > 0)
		lines.push(`Implements ${implemented.join(", ")}.`, "");
	const possible = (type.possibleTypes ?? []).map(x => link(x.name));
	if (possible.length > 0)
		lines.push(`${type.kind === "UNION" ? "One of" : "Implemented by"} ${possible.join(", ")}.`, "");

	switch (type.kind) {
		case "OBJECT":
		case "INTERFACE":
			lines.push("| Field | Type | Description |", "| :--- | :--- | :--- |");
			for (const field of type.fields) {
				const args = field.args.map(x => `<br>\`${x.name}\`: ${typeRef(x.type)} - ${cell(argument(x))}`).join("");
				lines.push(`| \`${field.name}\` | ${typeRef(field.type)} | ${deprecated(field)}${cell(field.description)}${args} |`);
			}
			break;
		case "INPUT_OBJECT":
			lines.push("| Input field | Type | Description |", "| :--- | :--- | :--- |");
			for (const field of type.inputFields)
				lines.push(`| \`${field.name}\` | ${typeRef(field.type)} | ${cell(argument(field))} |`);
			break;
		case "ENUM":
			lines.push("| Value | Description |", "| :--- | :--- |");
			for (const value of type.enumValues)
				lines.push(`| \`${value.name}\` | ${deprecated(value)}${cell(value.description)} |`);
			break;
		default:
			if (!type.description)
				lines.push(`A ${type.kind.toLowerCase()}.`);
	}

	return page(type.name, firstSentence(type.description) || `The ${type.name} type.`, lines);
}

// #endregion

// #region helpers

function write(file, content) {
	fs.writeFileSync(path.join(outDir, file), content);
}

function page(title, description, lines) {
	return [
		"---",
		`title: ${JSON.stringify(title)}`,
		`description: ${JSON.stringify(description || title)}`,
		"editUrl: false",
		"---",
		"",
		...lines,
		"",
	].join("\n");
}

function named(ref) {
	return ref.ofType ? named(ref.ofType) : ref.name;
}

function link(name) {
	return `[${name}](${base}/types/${name.toLowerCase()}/)`;
}

// the type in GraphQL notation, with its named type linked: \[[Onsale](...)!\]!
function typeRef(ref) {
	switch (ref.kind) {
		case "NON_NULL":
			return `${typeRef(ref.ofType)}!`;
		case "LIST":
			return `\\[${typeRef(ref.ofType)}\\]`;
		default:
			return link(ref.name);
	}
}

function connectionNode(ref, types) {
	const type = types.get(named(ref));
	const edges = type?.fields?.find(x => x.name === "edges");
	if (!edges || !type.fields.some(x => x.name === "pageInfo"))
		return null;

	const node = types.get(named(edges.type)).fields.find(x => x.name === "node");
	return node ? named(node.type) : null;
}

function argument(value) {
	const text = value.description ?? "";
	return value.defaultValue == null ? text : `${text} Default: \`${value.defaultValue}\`.`.trim();
}

function deprecated(member) {
	return member.isDeprecated ? `**Deprecated:** ${cell(member.deprecationReason)} ` : "";
}

function firstSentence(text) {
	const match = (text ?? "").trim().match(/^.*?[.?!](?=\s|$)/s);
	return match ? match[0] : (text ?? "").trim();
}

function title(name) {
	return name.charAt(0).toUpperCase() + name.slice(1);
}

// text from the schema, made safe for markdown: no tags, and inside a table no pipes or line breaks
function cell(text, { multiline = false } = {}) {
	const safe = (text ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
	return multiline ? safe : safe.replaceAll("|", "\\|").replace(/\r?\n/g, "<br>");
}

// #endregion
