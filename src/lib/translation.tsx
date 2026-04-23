import { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';

interface Language {
  code: string;
  name: string;
}

interface TranslationContextType {
  currentLang: string;
  setCurrentLang: (lang: string) => void;
  languages: Language[];
  t: (text: string) => string;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error('useTranslation must be inside TranslationProvider');
  return ctx;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'pt', name: 'Português' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'zh-CN', name: '简体中文' },
  { code: 'ja', name: '日本語' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'ko', name: '한국어' },
  { code: 'ru', name: 'Русский' },
  { code: 'it', name: 'Italiano' },
  { code: 'pl', name: 'Polski' },
  { code: 'th', name: 'ไทย' },
  { code: 'tl', name: 'Filipino' }
];

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [currentLang, setCurrentLangState] = useState('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadTranslations = useCallback(async (lang: string) => {
    setIsLoading(true);
    try {
      const module = await import(`../locales/${lang}.json`);
      setTranslations(module.default || module);
    } catch (err) {
      console.error(`Failed to load translations for ${lang}:`, err);
      // Fallback to English if possible
      if (lang !== 'en') {
        const enModule = await import('../locales/en.json');
        setTranslations(enModule.default || enModule);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get('lang')?.toLowerCase();
    
    // Validate if the language exists in our supported list
    const foundLang = LANGUAGES.find(l => l.code.toLowerCase() === langParam);
    const initialLang = foundLang ? foundLang.code : 'en';
    
    setCurrentLangState(initialLang);
    loadTranslations(initialLang);
  }, [loadTranslations]);

  const setCurrentLang = useCallback(async (lang: string) => {
    setCurrentLangState(lang);
    await loadTranslations(lang);
    
    const url = new URL(window.location.href);
    if (lang === 'en') {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', lang);
    }
    window.history.replaceState({}, '', url.toString());
  }, [loadTranslations]);

  const t = useCallback((text: string): string => {
    const raw = translations[text] || text;
    
    // Simple HTML entity decoder for common characters (Google Translate artifacts)
    return raw
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  }, [translations]);

  return (
    <TranslationContext.Provider value={{ currentLang, setCurrentLang, languages: LANGUAGES, t, isLoading }}>
      {children}
    </TranslationContext.Provider>
  );
}
