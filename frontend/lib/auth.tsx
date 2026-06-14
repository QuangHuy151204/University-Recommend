'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import type { AuthUser } from '@/types';
import { getMe, logout as logoutRequest } from '@/services/auth';
const COOKIE_SESSION_TOKEN = 'cookie-session';

/** Đặt khi user vừa đăng nhập — chatbot đọc để mở cuộc trò chuyện mới lần đầu vào /chatbot. */
export const CHATBOT_FRESH_AFTER_LOGIN_KEY = 'ur_chatbot_new_after_login';

export function markChatbotFreshAfterLogin() {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem(CHATBOT_FRESH_AFTER_LOGIN_KEY, '1');
    }
}

interface AuthState {
    token: string | null;
    user: AuthUser | null;
    /**
     * `true` trên server + lần render đầu trên client (trước khi đọc localStorage).
     * Khi `false`, `token`/`user` đã phản ánh đúng trạng thái thực tế.
     * Dùng cờ này để tránh hydration mismatch ở các component phụ thuộc auth.
     */
    loading: boolean;
    login: (token: string, user: AuthUser) => void;
    logout: () => void;
    refreshUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        getMe()
            .then((me) => {
                if (cancelled) return;
                setToken(COOKIE_SESSION_TOKEN);
                setUser({
                    id: me.id,
                    name: me.name,
                    email: me.email,
                    role: me.role,
                });
            })
            .catch(() => {
                if (cancelled) return;
                setToken(null);
                setUser(null);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const login = useCallback((_: string, newUser: AuthUser) => {
        setToken(COOKIE_SESSION_TOKEN);
        setUser(newUser);
        markChatbotFreshAfterLogin();
    }, []);

    const logout = useCallback(() => {
        void logoutRequest().catch(() => {});
        setToken(null);
        setUser(null);
    }, []);

    const refreshUser = useCallback((newUser: AuthUser) => {
        setUser(newUser);
    }, []);

    const value = useMemo<AuthState>(
        () => ({ token, user, loading, login, logout, refreshUser }),
        [token, user, loading, login, logout, refreshUser],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used inside <AuthProvider>');
    }
    return ctx;
}
