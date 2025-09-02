'use client';
import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeSync() {
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        if (!resolvedTheme) return;
        try {
            const expires = new Date();
            expires.setFullYear(expires.getFullYear() + 1);
            document.cookie = `theme=${resolvedTheme}; path=/; expires=${expires.toUTCString()}`;
        } catch { }
    }, [resolvedTheme]);

    return null;
}
