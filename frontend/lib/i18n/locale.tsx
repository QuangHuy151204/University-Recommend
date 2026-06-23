'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useSyncExternalStore,
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

const localeListeners = new Set<() => void>();

function emitLocaleChange() {
    for (const listener of localeListeners) {
        listener();
    }
}

function subscribeLocale(onStoreChange: () => void) {
    localeListeners.add(onStoreChange);
    const onStorage = (e: StorageEvent) => {
        if (e.key === LOCALE_STORAGE_KEY) onStoreChange();
    };
    window.addEventListener('storage', onStorage);
    return () => {
        localeListeners.delete(onStoreChange);
        window.removeEventListener('storage', onStorage);
    };
}

function getLocaleSnapshot(): Locale {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return stored === 'en' || stored === 'vi' ? stored : 'vi';
}

function getServerLocaleSnapshot(): Locale {
    return 'vi';
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
    const locale = useSyncExternalStore(
        subscribeLocale,
        getLocaleSnapshot,
        getServerLocaleSnapshot,
    );

    useEffect(() => {
        document.documentElement.lang = locale;
    }, [locale]);

    const setLocale = useCallback((next: Locale) => {
        localStorage.setItem(LOCALE_STORAGE_KEY, next);
        document.documentElement.lang = next;
        emitLocaleChange();
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
