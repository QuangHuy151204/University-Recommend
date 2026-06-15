'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    LOCALE_STORAGE_KEY,
    translate,
    type Locale,
    type TranslationKey,
} from '@/lib/i18n/translations';

interface LocaleContextValue {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(() => {
        if (typeof window === 'undefined') return 'vi';
        const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
        return stored === 'en' || stored === 'vi' ? stored : 'vi';
    });

    useEffect(() => {
        document.documentElement.lang = locale;
        localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    }, [locale]);

    const setLocale = useCallback((next: Locale) => {
        setLocaleState(next);
    }, []);

    const t = useCallback(
        (key: TranslationKey, params?: Record<string, string | number>) =>
            translate(locale, key, params),
        [locale],
    );

    const value = useMemo(
        () => ({ locale, setLocale, t }),
        [locale, setLocale, t],
    );

    return (
        <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
    );
}

export function useLocale() {
    const ctx = useContext(LocaleContext);
    if (!ctx) {
        throw new Error('useLocale must be used within LocaleProvider');
    }
    return ctx;
}
