import { base, defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

import { remarkWikiRefs } from 'remark-wikirefs';
import { remarkCaml } from 'remark-caml';

import {
	resolveHtmlHref,
	resolveHtmlText,
	resolveEmbedContent,
	generateForeRefsRemarkPlugin,
} from './src/wikibonsai/wikirefs';


// https://astro.build/config
export default defineConfig({
	site: 'https://astro-wikibonsai.netlify.app',
	integrations: [
		sitemap(),
	],
	assetsInclude: true,
	markdown: {
		// Preserve Astro's default plugins: GitHub-flavored Markdown and Smartypants
		extendDefaultPlugins: true,
		// Applied to .md and .mdx files
		remarkPlugins: [
			remarkCaml,
			[
				remarkWikiRefs,
				{
					baseUrl: base,
					resolveHtmlHref: resolveHtmlHref,
					resolveHtmlText: resolveHtmlText,
					resolveEmbedContent: resolveEmbedContent,
				},
			],
			// this plugin is necessary for backrefs to work
			generateForeRefsRemarkPlugin,
		],
	},
});
