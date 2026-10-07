'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../stores/AuthStore';
import { clearAuth, getAccessToken, getStoredUser, saveAuth } from '../lib/api/auth';
import authService from '../lib/api/services/authService';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const setUser = useAuthStore((state) => state.setUser);
    const setInitialized = useAuthStore((state) => state.setInitialized);

    useEffect(() => {
        // Hydrate auth state from localStorage on mount, then validate the
        // session against the API so a stale/revoked token is dropped instead
        // of letting the dashboards render and 401 on every call.
        const storedUser = getStoredUser();
        const token = getAccessToken();

        if (storedUser && token) {
            setUser(storedUser);
        } else if (!token) {
            clearAuth();
            setUser(null);
        }
        setInitialized(true);

        if (!token) return;

        let cancelled = false;
        authService
            .me()
            .then((user) => {
                if (cancelled) return;
                // Keep the stored copy fresh (role, email).
                const access = getAccessToken();
                const refresh = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
                if (access && refresh) {
                    saveAuth({ user, tokens: { access, refresh } });
                }
                setUser(user);
            })
            .catch((error: unknown) => {
                if (cancelled) return;
                // The axios interceptor already attempted a refresh; a 401 here
                // means the session is gone.
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    clearAuth();
                    setUser(null);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [setUser, setInitialized]);

    return <>{children}</>;
}
