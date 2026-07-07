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
			// caml owns the attrbox; disable wikirefs' redundant attr-BLOCK parsing
			// (avoids duplicate attrbox-data). wikirefs still resolves the wiki VALUES
			// inside caml's attrbox via its enrich transformer. See caml-wikiref-enrich-seam.
			attrs: { enable: false },
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
