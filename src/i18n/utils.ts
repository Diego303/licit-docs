import { translations, type Locale, type Translations } from './translations';

export function getTranslations(lang: Locale): Translations {
  return translations[lang];
}

export function getAlternateUrl(url: URL, targetLocale: Locale): string {
  const base = import.meta.env.BASE_URL;
  const pathname = url.pathname.replace(base, '');
  const withoutLocale = pathname.replace(/^en\//, '');

  if (targetLocale === 'es') return `${base}${withoutLocale}`;
  return `${base}en/${withoutLocale}`;
}

export function getDocsUrl(lang: Locale): string {
  const base = import.meta.env.BASE_URL;
  return lang === 'es' ? `${base}docs/` : `${base}en/docs/`;
}

export function getDocUrl(lang: Locale, slug: string): string {
  const base = import.meta.env.BASE_URL;
  return lang === 'es' ? `${base}docs/${slug}/` : `${base}en/docs/${slug}/`;
}

export function getLandingUrl(lang: Locale): string {
  const base = import.meta.env.BASE_URL;
  return lang === 'es' ? base : `${base}en/`;
}
