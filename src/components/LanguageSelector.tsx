import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Search } from 'lucide-react';
import { useTranslation } from '@/lib/translation';

export default function LanguageSelector() {
  const { currentLang, setCurrentLang, languages, isLoading, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  const currentLanguage = languages.find(l => l.code === currentLang);
  const filtered = languages.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border border-border bg-card/80 backdrop-blur-sm text-foreground hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
      >
        <Globe className="w-4 h-4 text-primary" />
        <span className="hidden sm:inline">{currentLanguage?.name || currentLang.toUpperCase()}</span>
        <span className="sm:hidden">{currentLang.toUpperCase()}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        {isLoading && (
          <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 max-h-80 bg-card border border-border rounded-xl shadow-2xl shadow-black/10 overflow-hidden z-50 animate-scale-in">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('Search languages...')}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-60">
            {filtered.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setCurrentLang(lang.code);
                  setOpen(false);
                  setSearch('');
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-150 flex items-center justify-between ${
                  lang.code === currentLang
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <span>{lang.name}</span>
                <span className="text-xs text-muted-foreground font-mono">{lang.code.toUpperCase()}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">{t('No languages found')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
