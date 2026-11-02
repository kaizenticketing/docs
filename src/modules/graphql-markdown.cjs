// GraphQL-Markdown's Starlight formatter, extended as its docs describe
// (https://graphql-markdown.dev/docs/advanced/integration-with-frameworks#extending-a-preset).
//
// printTypeOptions.parentTypePrefix: false is documented but not honoured in 1.2.0 - every argument and field is
// printed as "parent.name" - so this drops the parent here. Remove it once a release honours the option.
const StarlightMDX = require("@graphql-markdown/formatters/starlight");

const formatMDXNameEntity = (name) => StarlightMDX.formatMDXNameEntity(name);

// the loader builds the formatter from createMDXFormatter when a module exports one, ahead of the functions beside
// it, so the override has to go through it too
const createMDXFormatter = (meta) => ({
	...StarlightMDX.createMDXFormatter(meta),
	formatMDXNameEntity,
});

module.exports = {
	...StarlightMDX,
	formatMDXNameEntity,
	createMDXFormatter,
};
