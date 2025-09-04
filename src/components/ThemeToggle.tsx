'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    const next = (resolvedTheme === 'dark') ? 'light' : 'dark';

    async function onToggle() {
        setTheme(next);
        try {
            const expires = new Date();
            expires.setFullYear(expires.getFullYear() + 1);
            document.cookie = `theme=${next}; path=/; expires=${expires.toUTCString()}`;
        } catch { }
    }

    if (!mounted) {
        return (
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-200/70 dark:bg-gray-800/70">
                <Sun className="w-4 h-4" />
                {/* <span>Theme</span> */}
            </button>
        );
    }

    return (
        <button
            onClick={onToggle}
            aria-label="Toggle theme"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-200/70 dark:bg-gray-800/70 hover:bg-gray-300/70 dark:hover:bg-gray-700/70 transition text-sm cursor-pointer"
        >
            {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {/* <span>{resolvedTheme === 'dark' ? 'Light' : 'Dark'}</span> */}
        </button>
    );
}
