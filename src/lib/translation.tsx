import { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';

const GOOGLE_TRANSLATE_API_KEY = 'AIzaSyDgyWwwmHOROsPZclCm-LGzZs_uoYNhVDk';

interface Language {
  code: string;
  name: string;
}

interface TranslationContextType {
  currentLang: string;
  setCurrentLang: (lang: string) => void;
  languages: Language[];
  translate: (text: string) => Promise<string>;
  t: (text: string) => string;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error('useTranslation must be inside TranslationProvider');
  return ctx;
}

// Cache translations to avoid repeated API calls
const translationCache: Record<string, Record<string, string>> = {};

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [currentLang, setCurrentLangState] = useState('en');
  const [languages, setLanguages] = useState<Language[]>([
    { code: 'en', name: 'English' },
  ]);
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load languages from Google API
  useEffect(() => {
    async function fetchLanguages() {
      try {
        const res = await fetch(
          `https://translation.googleapis.com/language/translate/v2/languages?key=${GOOGLE_TRANSLATE_API_KEY}&target=en`
        );
        const data = await res.json();
        if (data.data?.languages) {
          const langs: Language[] = data.data.languages.map((l: any) => ({
            code: l.language,
            name: l.name || l.language,
          }));
          langs.sort((a, b) => a.name.localeCompare(b.name));
          setLanguages(langs);
        }
      } catch (err) {
        console.error('Failed to fetch languages:', err);
      }
    }
    fetchLanguages();
  }, []);

  // Check URL param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get('lang');
    if (langParam) {
      setCurrentLangState(langParam.toLowerCase());
    }
  }, []);

  const setCurrentLang = useCallback((lang: string) => {
    setCurrentLangState(lang);
    // Update URL
    const url = new URL(window.location.href);
    if (lang === 'en') {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', lang.toUpperCase());
    }
    window.history.replaceState({}, '', url.toString());
  }, []);

  const translate = useCallback(async (text: string): Promise<string> => {
    if (currentLang === 'en') return text;
    
    // Check cache
    if (translationCache[currentLang]?.[text]) {
      return translationCache[currentLang][text];
    }

    try {
      const res = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: text,
            target: currentLang,
            source: 'en',
          }),
        }
      );
      const data = await res.json();
      const translated = data.data?.translations?.[0]?.translatedText || text;
      
      // Cache it
      if (!translationCache[currentLang]) translationCache[currentLang] = {};
      translationCache[currentLang][text] = translated;
      
      return translated;
    } catch {
      return text;
    }
  }, [currentLang]);

  // Batch translate UI strings when language changes
  useEffect(() => {
    if (currentLang === 'en') {
      setTranslatedTexts({});
      return;
    }

    const uiStrings = [
      'Performance & Focus Tracker',
      'Track. Measure. Optimize your daily performance.',
      'Execution Score',
      'Measures how effectively you turned priorities into completed results today.',
      'Mental Clarity',
      'Measures how mentally sharp, focused, and cognitively clear you felt today.',
      'Poor execution',
      'Exceptional',
      'Foggy / Distracted',
      'Sharp / Focused',
      'Did you complete your most important task today?',
      'Yes',
      'No',
      'What impacted your performance the most?',
      'Distraction',
      'Emotional State',
      'Lack of Clarity',
      'External Dependency',
      'Low Energy',
      'No Major Blocker',
      'Other',
      'Please specify',
      'Describe what impacted your performance…',
      'How deep was your work today?',
      'Optional',
      'Surface-Level Tasks',
      'Admin, emails, quick tasks',
      'Focused Work',
      'Structured, goal-oriented work',
      'Deep Work',
      'High-intensity, creative work',
      'Custom',
      'Describe your own work depth',
      'Describe your work depth',
      'Example: Strategy planning, creative brainstorming…',
      'Save Today\'s Entry',
      'Entry Saved Successfully',
      'Edit today\'s entry',
      'View Performance Insights',
      'Log at least 3 days to see performance insights.',
      '7-Day Execution Trend',
      'Focus × Execution',
      'Consistency Score',
      'Blocker Frequency (14 Days)',
    ];

    // Check if all are cached
    const allCached = uiStrings.every(s => translationCache[currentLang]?.[s]);
    if (allCached) {
      const map: Record<string, string> = {};
      uiStrings.forEach(s => { map[s] = translationCache[currentLang][s]; });
      setTranslatedTexts(map);
      return;
    }

    setIsLoading(true);

    async function batchTranslate() {
      try {
        const res = await fetch(
          `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              q: uiStrings,
              target: currentLang,
              source: 'en',
            }),
          }
        );
        const data = await res.json();
        const translations = data.data?.translations || [];
        const map: Record<string, string> = {};
        if (!translationCache[currentLang]) translationCache[currentLang] = {};
        uiStrings.forEach((s, i) => {
          const translated = translations[i]?.translatedText || s;
          map[s] = translated;
          translationCache[currentLang][s] = translated;
        });
        setTranslatedTexts(map);
      } catch {
        // fallback to english
      } finally {
        setIsLoading(false);
      }
    }

    batchTranslate();
  }, [currentLang]);

  const t = useCallback((text: string): string => {
    if (currentLang === 'en') return text;
    return translatedTexts[text] || text;
  }, [currentLang, translatedTexts]);

  return (
    <TranslationContext.Provider value={{ currentLang, setCurrentLang, languages, translate, t, isLoading }}>
      {children}
    </TranslationContext.Provider>
  );
}
