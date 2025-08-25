'use client'

import { Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
const DashboardPage = () => {
    const router = useRouter();
    const handleLogOut = () => {
        localStorage.removeItem('isAuth');
        router.push('/login');
    }
    return (
        <Container>
            <Typography variant="h3" component="h4">Welcome to Dashboard!</Typography>
            <Container>
                <Button variant="outlined" onClick={handleLogOut}>Logout</Button>
            </Container>
        </Container >
    );
};
export default DashboardPage;
