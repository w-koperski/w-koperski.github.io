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
      type: z.literal('terminal'),
      commands: z.object({
        pl: z.array(z.object({
          command: z.string(),
          output: z.string(),
        })),
        en: z.array(z.object({
          command: z.string(),
          output: z.string(),
        })),
      }),
    }),
    z.object({
      type: z.literal('browser'),
      liveUrl: z.string().url().optional(),
      screenshots: z.array(z.string()),
    }),
    z.object({
      type: z.literal('api'),
      endpoints: z.array(z.object({
        method: z.string(),
        path: z.string(),
        description: z.object({
          pl: z.string(),
          en: z.string(),
        }),
        requestExample: z.string(),
        responseExample: z.string(),
      })),
    }),
    z.object({
      type: z.literal('metrics'),
      epochs: z.number(),
      accuracyData: z.array(z.number()),
      lossData: z.array(z.number()),
      finalAccuracy: z.string(),
      samplePredictions: z.array(z.object({
        input: z.string(),
        output: z.string(),
      })).optional(),
    }),
  ]).optional(),
});

const projects = defineCollection({
  type: 'data',
  schema: projectSchema,
});

export type PreviewType = 'terminal' | 'browser' | 'api' | 'metrics';
export type ProjectPreviewData = z.infer<typeof projectSchema>['previewData'];
export type ProjectDetailContent = {
  longDescription?: z.infer<typeof projectSchema>['longDescription'];
  codeSnippets?: z.infer<typeof projectSchema>['codeSnippets'];
  highlights?: z.infer<typeof projectSchema>['highlights'];
};

export const collections = { projects };
