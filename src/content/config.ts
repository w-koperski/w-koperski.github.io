import { defineCollection, z } from 'astro:content';

const projectSchema = z.object({
  title: z.string(),
  category: z.enum([
    'python-cli',
    'rust-cli',
    'vue-spa',
    'react-spa',
    'laravel-api',
    'cpp',
    'python-ml',
    'csharp-api',
  ]),
  categoryEmoji: z.string(),
  description: z.object({
    pl: z.string(),
    en: z.string(),
  }),
  techStack: z.array(z.string()),
  githubUrl: z.string().url(),
  demoUrl: z.string().url().optional(),
  screenshot: z.string().optional(),
  year: z.number(),
  featured: z.boolean().default(false),
});

const projects = defineCollection({
  type: 'data',
  schema: projectSchema,
});

export const collections = { projects };
