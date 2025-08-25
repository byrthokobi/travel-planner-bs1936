import { Box, Button, Toolbar, Typography } from '@mui/material';
import React from 'react'

export const Navbar: React.FC = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Toolbar sx={{
                backgroundColor: '#424242',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-around',
                padding: '10px 20px'
            }}>
                <Typography variant="h6" component="div">
                    My App
                </Typography>
                <Box>
                    <Button color="inherit">Home</Button>
                    <Button color="inherit">About</Button>
                    <Button color="inherit">Contact</Button>
                </Box>
            </Toolbar>
        </Box>
    );
}
