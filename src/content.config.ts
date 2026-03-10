import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docsSchema = z.object({
  title: z.string(),
  description: z.string(),
  order: z.number().default(0),
});

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: docsSchema,
});

const docsEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs-en' }),
  schema: docsSchema,
});

export const collections = { docs, 'docs-en': docsEn };
