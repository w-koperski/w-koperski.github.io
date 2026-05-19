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
  slug: z.string().optional(),
  longDescription: z.object({
    pl: z.string(),
    en: z.string(),
  }).optional(),
  codeSnippets: z.array(z.object({
    title: z.string(),
    language: z.string(),
    code: z.string(),
  })).optional(),
  highlights: z.object({
    pl: z.array(z.string()),
    en: z.array(z.string()),
  }).optional(),
  previewData: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('browser'),
      liveUrl: z.string().url().optional(),
      screenshots: z.array(z.string()).min(1),
    }),
    z.object({
      type: z.enum(['cli', 'api', 'ml']),
      liveUrl: z.string().url().optional(),
      screenshots: z.array(z.string()).min(1).optional(),
    })
  ]).optional(),
});

const projects = defineCollection({
  type: 'data',
  schema: projectSchema,
});

export type PreviewType = 'browser' | 'cli' | 'api' | 'ml';
export type ProjectPreviewData = z.infer<typeof projectSchema>['previewData'];
export type ProjectDetailContent = {
  longDescription?: z.infer<typeof projectSchema>['longDescription'];
  codeSnippets?: z.infer<typeof projectSchema>['codeSnippets'];
  highlights?: z.infer<typeof projectSchema>['highlights'];
};

export const collections = { projects };
