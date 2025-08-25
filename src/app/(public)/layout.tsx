'use client'
import { Navbar } from '@/components/Navbar';
import { Container } from '@mui/material';
import React from 'react'

const layoutPublic: React.FC = ({ children }) => {
    return (
        <main>{children}</main>
    )
}

export default layoutPublic;
