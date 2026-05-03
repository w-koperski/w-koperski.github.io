export const categories = [
  {
    slug: 'python-cli',
    emoji: '🐍',
    name: { pl: 'Narzędzia Python CLI', en: 'Python CLI Tools' },
  },
  {
    slug: 'rust-cli',
    emoji: '🦀',
    name: { pl: 'Narzędzia Rust CLI', en: 'Rust CLI Tools' },
  },
  {
    slug: 'vue-spa',
    emoji: '💚',
    name: { pl: 'Aplikacje Vue', en: 'Vue Apps' },
  },
  {
    slug: 'react-spa',
    emoji: '⚛️',
    name: { pl: 'Aplikacje React', en: 'React Apps' },
  },
  {
    slug: 'laravel-api',
    emoji: '🔷',
    name: { pl: 'API Laravel', en: 'Laravel APIs' },
  },
  {
    slug: 'cpp',
    emoji: '⚙️',
    name: { pl: 'Projekty C++', en: 'C++ Projects' },
  },
  {
    slug: 'python-ml',
    emoji: '🧠',
    name: { pl: 'Machine Learning', en: 'Machine Learning' },
  },
  {
    slug: 'csharp-api',
    emoji: '🟣',
    name: { pl: 'API C#', en: 'C# APIs' },
  },
] as const;

export type CategorySlug = (typeof categories)[number]['slug'];
