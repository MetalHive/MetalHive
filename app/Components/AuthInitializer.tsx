'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../stores/AuthStore';
import { getStoredUser } from '../lib/api/auth';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        // Initialize auth state from localStorage on mount
        const user = getStoredUser();
        if (user) {
            setUser(user);
        }
    }, [setUser]);

    return <>{children}</>;
}
