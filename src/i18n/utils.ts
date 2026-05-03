import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string, l: string = lang) {
    return l === defaultLang ? path : `/${l}${path}`;
  };
}

export function t(
  key: keyof (typeof ui)[typeof defaultLang],
  lang: keyof typeof ui = defaultLang,
) {
  return ui[lang][key] || ui[defaultLang][key];
}
