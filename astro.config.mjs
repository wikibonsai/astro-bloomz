import { base, defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { remarkWikiRefs } from 'remark-wikirefs';
import { remarkCaml } from 'remark-caml';

import {
	resolveHtmlHref,
	resolveHtmlText,
	createResolveEmbedContent,
	generateForeRefsRemarkPlugin,
} from './src/wikibonsai/wikirefs';


const remarkPlugins = [
	remarkCaml,
	[
		remarkWikiRefs,
		{
			// caml owns the attrbox — remark-wikirefs auto-detects this (remark-caml
			// registered before it claims `data.attrBox`) and stands down its own
			// attr-block parsing, while still resolving wiki VALUES. No attrs config
			// needed. See caml-wikiref-enrich-seam.
			resolveHtmlHref: resolveHtmlHref,
			resolveHtmlText: resolveHtmlText,
			resolveEmbedContent: null, // we'll set this later -- see below
		},
	],
	generateForeRefsRemarkPlugin,
];

// embed content needs access to a unified processor
const resolveEmbedContent = createResolveEmbedContent(remarkPlugins);
remarkPlugins[1][1].resolveEmbedContent = resolveEmbedContent;

// https://astro.build/config
export default defineConfig({
	site: 'https://astro-bloomz.netlify.app',
	integrations: [
		sitemap(),
	],
	assetsInclude: true,
	markdown: {
		// Preserve Astro's default plugins: GitHub-flavored Markdown and Smartypants
		extendDefaultPlugins: true,
		// Applied to .md and .mdx files
		remarkPlugins: remarkPlugins,
	},
});
