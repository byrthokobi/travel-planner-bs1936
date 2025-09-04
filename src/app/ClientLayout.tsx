// app/ClientLayout.tsx
'use client';

import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import Providers from "./providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClientLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Providers>
                <Navbar />
                <main>
                    {children}
                </main>
                <ToastContainer position="top-right" autoClose={2000} />
            </Providers>
        </>
    );
}