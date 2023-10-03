import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

const entries = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date().optional(),
		updatedDate: z.coerce.date().optional(),
	}),
});

const index = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
	}),
});

export const collections = { blog, entries, index };
