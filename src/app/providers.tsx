'use client'

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ThemeSync from "@/components/ThemeSync";

export default function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <SessionProvider>
            <NextThemesProvider attribute="class" enableSystem>
                <ThemeSync />
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </NextThemesProvider>
        </SessionProvider>
    );
}
